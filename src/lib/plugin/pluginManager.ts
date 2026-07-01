import type {
  PluginEntry,
  Plugin,
  ApiRouter,
  ApiRoute,
  PluginPermission,
} from "./types";
import { loadBuiltinPlugins } from "./loader";
import { registerBuiltinPlugins } from "./builtins";
import {
  registerPluginHooks,
  unregisterPluginHooks,
  getApiHookHandlers,
} from "./hookSystem";
import { globalEventBus } from "./eventBus";
import { pluginRegistry } from "./registry";

const VALID_PERMISSIONS: PluginPermission[] = [
  "READ_POST",
  "WRITE_POST",
  "DELETE_POST",
  "READ_USER",
  "WRITE_USER",
  "MANAGE_COMMENTS",
  "SEND_EMAIL",
  "ACCESS_ANALYTICS",
  "MANAGE_PLUGINS",
];

export class PluginManager {
  private entries = new Map<string, PluginEntry>();
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;
    await registerBuiltinPlugins();
    const loaded = await loadBuiltinPlugins();
    for (const entry of loaded) {
      if (entry.plugin) {
        const name = entry.plugin.manifest.name;
        this.entries.set(name, entry);
        pluginRegistry.register(name, name, entry.plugin);
      }
    }
    this.initialized = true;
  }

  getEntries(): Map<string, PluginEntry> {
    return this.entries;
  }

  getEntry(name: string): PluginEntry | undefined {
    return this.entries.get(name);
  }

  async activate(name: string): Promise<boolean> {
    const entry = this.entries.get(name);
    if (!entry || entry.status === "error") return false;
    if (entry.status === "active") return true;

    const plugin = entry.plugin;
    if (!plugin) return false;

    const permError = this.validatePermissions(plugin.manifest.permissions);
    if (permError) {
      entry.status = "error";
      entry.error = permError;
      pluginRegistry.updateStatus(name, "error", permError);
      return false;
    }

    try {
      if (plugin.onActivate) {
        await this.sandboxedExecute(name, () => plugin.onActivate!());
      }
      entry.status = "active";
      registerPluginHooks(plugin, entry);
      pluginRegistry.updateStatus(name, "active");

      await globalEventBus.emit({
        type: "PLUGIN_ACTIVATED",
        payload: {
          name: plugin.manifest.name,
          version: plugin.manifest.version,
        },
        timestamp: new Date(),
        source: "pluginManager",
      });

      return true;
    } catch (error) {
      entry.status = "error";
      entry.error =
        error instanceof Error ? error.message : "Activation failed";
      pluginRegistry.updateStatus(name, "error", entry.error);
      return false;
    }
  }

  async deactivate(name: string): Promise<boolean> {
    const entry = this.entries.get(name);
    if (!entry || entry.status !== "active") return false;

    const plugin = entry.plugin;
    if (!plugin) return false;

    try {
      if (plugin.onDeactivate) {
        await this.sandboxedExecute(name, () => plugin.onDeactivate!());
      }
      entry.status = "inactive";
      unregisterPluginHooks(plugin);
      pluginRegistry.updateStatus(name, "inactive");

      await globalEventBus.emit({
        type: "PLUGIN_DEACTIVATED",
        payload: { name: plugin.manifest.name },
        timestamp: new Date(),
        source: "pluginManager",
      });

      return true;
    } catch {
      return false;
    }
  }

  async registerFromModule(
    importFn: () => Promise<{ plugin?: Plugin; default?: Plugin }>,
    dirName?: string,
  ): Promise<PluginEntry | null> {
    try {
      const mod = await importFn();
      const plugin = mod.plugin || mod.default;
      if (!plugin || !plugin.manifest?.name) return null;

      const name = plugin.manifest.name;
      if (this.entries.has(name)) return null;

      const permError = this.validatePermissions(plugin.manifest.permissions);
      if (permError) return null;

      const entry: PluginEntry = { plugin, status: "inactive" };
      this.entries.set(name, entry);
      pluginRegistry.register(name, dirName || name, plugin);

      if (plugin.onInstall) {
        try {
          await this.sandboxedExecute(name, () => plugin.onInstall!());
        } catch {
          entry.status = "error";
          entry.error = "Install hook failed";
          pluginRegistry.updateStatus(name, "error", "Install hook failed");
        }
      }

      await globalEventBus.emit({
        type: "PLUGIN_INSTALLED",
        payload: { name, version: plugin.manifest.version },
        timestamp: new Date(),
        source: "pluginManager",
      });

      return entry;
    } catch {
      return null;
    }
  }

  async uninstall(name: string): Promise<boolean> {
    const entry = this.entries.get(name);
    if (!entry) return false;

    if (entry.status === "active") {
      await this.deactivate(name);
    }

    const plugin = entry.plugin;
    if (plugin?.onUninstall) {
      try {
        await this.sandboxedExecute(name, () => plugin.onUninstall!());
      } catch {
        // cleanup continues even if hook fails
      }
    }

    this.entries.delete(name);
    pluginRegistry.unregister(name);

    await globalEventBus.emit({
      type: "PLUGIN_UNINSTALLED",
      payload: { name },
      timestamp: new Date(),
      source: "pluginManager",
    });

    return true;
  }

  getActivePlugins(): PluginEntry[] {
    return Array.from(this.entries.values()).filter(
      (e) => e.status === "active",
    );
  }

  getApiRoutes(): ApiRoute[] {
    const routes: ApiRoute[] = [];
    const handlers = getApiHookHandlers();

    const router: ApiRouter = {
      registerRoute: (route: ApiRoute) => {
        routes.push(route);
      },
    };

    for (const { handler } of handlers) {
      try {
        handler(router);
      } catch {
        // individual route registration failure is non-fatal
      }
    }

    return routes;
  }

  private validatePermissions(permissions: PluginPermission[]): string | null {
    for (const perm of permissions) {
      if (!VALID_PERMISSIONS.includes(perm)) {
        return `Invalid permission: ${perm}`;
      }
    }
    return null;
  }

  private async sandboxedExecute(
    pluginName: string,
    fn: () => Promise<void>,
  ): Promise<void> {
    const timeout = 10000;
    const timer = new Promise<never>((_, reject) =>
      setTimeout(
        () =>
          reject(
            new Error(
              `Plugin ${pluginName} execution timed out after ${timeout}ms`,
            ),
          ),
        timeout,
      ),
    );
    await Promise.race([fn(), timer]);
  }
}

export const pluginManager = new PluginManager();
