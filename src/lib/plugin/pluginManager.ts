import type { PluginEntry, Plugin, ApiRouter, ApiRoute } from "./types";
import { loadBuiltinPlugins } from "./loader";
import {
  registerPluginHooks,
  unregisterPluginHooks,
  getApiHookHandlers,
} from "./hookSystem";
import { globalEventBus } from "./eventBus";

export class PluginManager {
  private entries = new Map<string, PluginEntry>();
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;
    const loaded = await loadBuiltinPlugins();
    for (const entry of loaded) {
      if (entry.plugin) {
        this.entries.set(entry.plugin.manifest.name, entry);
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

    try {
      if (plugin.onActivate) {
        await plugin.onActivate();
      }
      entry.status = "active";
      registerPluginHooks(plugin, entry);

      await globalEventBus.emit({
        type: "PLUGIN_ACTIVATED",
        payload: { name: plugin.manifest.name },
        timestamp: new Date(),
        source: "pluginManager",
      });

      return true;
    } catch (error) {
      entry.status = "error";
      entry.error =
        error instanceof Error ? error.message : "Activation failed";
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
        await plugin.onDeactivate();
      }
      entry.status = "inactive";
      unregisterPluginHooks(plugin);

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
  ): Promise<PluginEntry | null> {
    try {
      const mod = await importFn();
      const plugin = mod.plugin || mod.default;
      if (!plugin || !plugin.manifest?.name) return null;

      const name = plugin.manifest.name;
      if (this.entries.has(name)) return null;

      const entry: PluginEntry = { plugin, status: "inactive" };
      this.entries.set(name, entry);

      if (plugin.onInstall) {
        try {
          await plugin.onInstall();
        } catch {
          entry.status = "error";
          entry.error = "Install hook failed";
        }
      }

      await globalEventBus.emit({
        type: "PLUGIN_INSTALLED",
        payload: { name },
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
        await plugin.onUninstall();
      } catch {
        // cleanup continues even if hook fails
      }
    }

    this.entries.delete(name);

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
}

export const pluginManager = new PluginManager();
