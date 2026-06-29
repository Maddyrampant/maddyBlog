export { pluginManager } from "./pluginManager";
export { globalEventBus } from "./eventBus";
export { runDataHooks, getUiHooks } from "./hookSystem";
export { registerBuiltinPlugin } from "./loader";
export type {
  Plugin,
  PluginManifest,
  PluginEntry,
  PluginContext,
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
} from "./types";
