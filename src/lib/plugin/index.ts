export { pluginManager } from "./pluginManager";
export { pluginRegistry } from "./registry";
export type { PluginRegistryEntry } from "./registry";
export { globalEventBus } from "./eventBus";
export { runDataHooks, getUiHooks, getAIPromptHooks } from "./hookSystem";
export { registerBuiltinPlugin } from "./loader";
export { BasePlugin } from "./basePlugin";
export { buildPluginContext } from "./context";
export type {
  Plugin,
  PluginManifest,
  PluginEntry,
  PluginContext,
  PluginCoreServices,
  PluginPermission,
  PluginHook,
  DataHook,
  UiHook,
  ApiHook,
  HookType,
  ApiRoute,
  ApiRouter,
  PluginEvent,
  EventHandler,
  PluginLogger,
  PluginConfig,
  PluginAuth,
  PluginPrisma,
} from "./types";
