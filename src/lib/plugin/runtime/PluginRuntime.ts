import { pluginManager } from "../pluginManager";
import { uiExtensionRegistry } from "../ui/UIExtensionRegistry";
import { editorExtensionRegistry } from "../editor/EditorExtensionRegistry";
import { themePluginBridge } from "../theme/ThemePluginBridge";
import { hookEngine } from "./HookEngine";
import { globalEventBus } from "../eventBus";
import type { Plugin, PluginHook, UiHook, PluginEntry } from "../types";
import type { UIExtensionPoint } from "../ui/UIExtensionRegistry";

export class PluginRuntime {
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;
    await pluginManager.initialize();
    this.initialized = true;
  }

  async activatePlugin(name: string): Promise<boolean> {
    const entry = pluginManager.getEntry(name);
    if (!entry) return false;
    if (entry.status === "active") return true;

    const ok = await pluginManager.activate(name);
    if (!ok) return false;

    const plugin = entry.plugin;
    if (plugin.hooks) {
      for (const hook of plugin.hooks) {
        this.registerHookOnEngine(name, hook);
      }
    }

    await globalEventBus.emit({
      type: "PLUGIN_ACTIVATED",
      payload: { name, version: plugin.manifest.version },
      timestamp: new Date(),
      source: "pluginRuntime",
    });

    return true;
  }

  async deactivatePlugin(name: string): Promise<boolean> {
    const entry = pluginManager.getEntry(name);
    if (!entry || entry.status !== "active") return false;

    hookEngine.unregisterAll(name);
    uiExtensionRegistry.unregisterAll(name);
    editorExtensionRegistry.unregisterAll(name);
    themePluginBridge.unregisterAll(name);

    const ok = await pluginManager.deactivate(name);
    if (!ok) return false;

    await globalEventBus.emit({
      type: "PLUGIN_DEACTIVATED",
      payload: { name },
      timestamp: new Date(),
      source: "pluginRuntime",
    });

    return true;
  }

  async installPlugin(
    importFn: () => Promise<{ plugin?: Plugin; default?: Plugin }>,
    dirName?: string,
  ): Promise<PluginEntry | null> {
    const entry = await pluginManager.registerFromModule(importFn, dirName);
    return entry;
  }

  async uninstallPlugin(name: string): Promise<boolean> {
    hookEngine.unregisterAll(name);
    uiExtensionRegistry.unregisterAll(name);
    editorExtensionRegistry.unregisterAll(name);
    themePluginBridge.unregisterAll(name);

    return pluginManager.uninstall(name);
  }

  executeHook<T>(
    hook: string,
    context: T,
    options?: { timeout?: number },
  ): Promise<T> {
    return hookEngine.execute(hook, context, options);
  }

  executeFirst<TResult>(
    hook: string,
    context: unknown,
    options?: { timeout?: number },
  ): Promise<TResult | null> {
    return hookEngine.executeFirst<TResult>(hook, context, options);
  }

  executeParallel<TResult>(
    hook: string,
    context: unknown,
    options?: { timeout?: number },
  ): Promise<TResult[]> {
    return hookEngine.executeParallel<TResult>(hook, context, options);
  }

  hasHook(hook: string): boolean {
    return hookEngine.hasHook(hook);
  }

  getActivePlugins(): PluginEntry[] {
    return pluginManager.getActivePlugins();
  }

  getEntry(name: string): PluginEntry | undefined {
    return pluginManager.getEntry(name);
  }

  private registerHookOnEngine(_name: string, hook: PluginHook): void {
    if (hook.type === "ui") {
      const uiHook = hook as UiHook;
      const point = this.mapUiHookToPoint(uiHook.hook);
      if (point) {
        uiExtensionRegistry.register(point, _name, uiHook.component);
      }
    }
  }

  private mapUiHookToPoint(hook: string): UIExtensionPoint | null {
    const map: Record<string, UIExtensionPoint> = {
      injectAdminSidebar: "admin:sidebar",
      injectPostView: "post:after:content",
      injectPostHeader: "post:before:content",
      injectPostFooter: "post:after:content",
      injectProfilePage: "post:sidebar",
    };
    return map[hook] ?? null;
  }
}

export const pluginRuntime = new PluginRuntime();
