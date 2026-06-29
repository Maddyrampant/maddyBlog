import type { ReactNode } from "react";
import type { HookType, Plugin, PluginEntry, PluginContext } from "./types";

const dataHooks = new Map<
  HookType,
  Array<{
    pluginName: string;
    handler: (data: unknown, ctx: PluginContext) => unknown | Promise<unknown>;
  }>
>();
const uiHooks = new Map<
  string,
  Array<{ pluginName: string; component: () => ReactNode }>
>();
const apiHooks: Array<{
  pluginName: string;
  handler: (router: import("./types").ApiRouter) => void;
}> = [];

export function registerPluginHooks(plugin: Plugin, entry: PluginEntry): void {
  if (entry.status !== "active") return;
  if (!plugin.hooks) return;

  for (const hook of plugin.hooks) {
    if (hook.type === "data") {
      if (!dataHooks.has(hook.hook)) {
        dataHooks.set(hook.hook, []);
      }
      dataHooks.get(hook.hook)!.push({
        pluginName: plugin.manifest.name,
        handler: hook.handler as (data: unknown, ctx: PluginContext) => unknown,
      });
    } else if (hook.type === "ui") {
      if (!uiHooks.has(hook.hook)) {
        uiHooks.set(hook.hook, []);
      }
      uiHooks.get(hook.hook)!.push({
        pluginName: plugin.manifest.name,
        component: hook.component,
      });
    } else if (hook.type === "api") {
      apiHooks.push({
        pluginName: plugin.manifest.name,
        handler: hook.handler,
      });
    }
  }
}

export function unregisterPluginHooks(plugin: Plugin): void {
  const name = plugin.manifest.name;
  for (const [, handlers] of dataHooks) {
    const idx = handlers.findIndex((h) => h.pluginName === name);
    if (idx >= 0) handlers.splice(idx, 1);
  }
  for (const [, components] of uiHooks) {
    const idx = components.findIndex((c) => c.pluginName === name);
    if (idx >= 0) components.splice(idx, 1);
  }
  const apiIdx = apiHooks.findIndex((h) => h.pluginName === name);
  if (apiIdx >= 0) apiHooks.splice(apiIdx, 1);
}

export async function runDataHooks(
  hook: HookType,
  data: unknown,
  ctx: PluginContext,
): Promise<unknown> {
  const handlers = dataHooks.get(hook);
  if (!handlers) return data;

  let result = data;
  for (const { handler } of handlers) {
    try {
      result = await handler(result, ctx);
    } catch {
      // individual hook failure should not block pipeline
    }
  }
  return result;
}

export function getUiHooks(
  hook: string,
): Array<{ pluginName: string; component: () => ReactNode }> {
  return uiHooks.get(hook) || [];
}

export function getApiHookHandlers(): Array<{
  pluginName: string;
  handler: (router: import("./types").ApiRouter) => void;
}> {
  return [...apiHooks];
}
