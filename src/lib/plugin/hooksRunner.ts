import { runDataHooks } from "./hookSystem";
import { buildPluginContext } from "./context";
import type { HookType } from "./types";

export async function runHook(hook: HookType, data: unknown): Promise<unknown> {
  try {
    const ctx = await buildPluginContext();
    return await runDataHooks(hook, data, ctx);
  } catch {
    return data;
  }
}
