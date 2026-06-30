import { HookEngine } from "./runtime/HookEngine";
import { PluginRuntime } from "./runtime/PluginRuntime";

export const bootstrapHookEngine = new HookEngine();
export const bootstrapPluginRuntime = new PluginRuntime(bootstrapHookEngine);
