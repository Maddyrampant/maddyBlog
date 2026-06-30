import { HookEngine } from "./HookEngine";
import type { Plugin, DataHook } from "../types";

export class PluginRuntime {
  private hookEngine: HookEngine;
  private activePlugins = new Map<string, Set<() => void>>();

  constructor(hookEngine: HookEngine) {
    this.hookEngine = hookEngine;
  }

  activate(plugin: Plugin): void {
    const pluginId = plugin.manifest.name;
    if (this.activePlugins.has(pluginId)) return;

    const unsubs = new Set<() => void>();

    plugin.onActivate?.();

    if (plugin.hooks) {
      for (const hook of plugin.hooks) {
        if (hook.type === "data") {
          const dataHook = hook as DataHook;
          const unsub = this.hookEngine.register(dataHook.hook, {
            id: `${pluginId}:${dataHook.hook}`,
            handler: async (data) => {
              return dataHook.handler(data, {} as never);
            },
          });
          unsubs.add(unsub);
        }
      }
    }

    this.activePlugins.set(pluginId, unsubs);
  }

  deactivate(plugin: Plugin): void {
    const pluginId = plugin.manifest.name;
    const unsubs = this.activePlugins.get(pluginId);
    if (!unsubs) return;

    for (const unsub of unsubs) {
      unsub();
    }
    this.activePlugins.delete(pluginId);

    plugin.onDeactivate?.();
  }

  execute<TContext, TResult>(
    hook: string,
    context: TContext,
  ): Promise<{ results: TResult[]; errors: import("./HookEngine").HookExecutionError[] }> {
    return this.hookEngine.execute<TContext, TResult>(hook, context);
  }

  isActive(name: string): boolean {
    return this.activePlugins.has(name);
  }

  clear(): void {
    this.hookEngine.clear();
    this.activePlugins.clear();
  }
}

export const pluginRuntime = new PluginRuntime(new HookEngine());
