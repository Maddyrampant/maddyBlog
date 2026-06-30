export { pluginManager } from "./pluginManager";
export { pluginRegistry } from "./registry";
export type { PluginRegistryEntry } from "./registry";
export { globalEventBus } from "./eventBus";
export { runDataHooks, getUiHooks, getAIPromptHooks } from "./hookSystem";
export { registerBuiltinPlugin } from "./loader";
export { BasePlugin } from "./basePlugin";
export { buildPluginContext } from "./context";
export { hookEngine, PluginRuntime, pluginRuntime } from "./runtime";
export type { HookEngine } from "./runtime/HookEngine";
export { uiExtensionRegistry } from "./ui/UIExtensionRegistry";
export type {
  UIExtensionPoint,
  UIExtensionEntry,
} from "./ui/UIExtensionRegistry";
export { editorExtensionRegistry } from "./editor/EditorExtensionRegistry";
export type { EditorExtensionEntry } from "./editor/EditorExtensionRegistry";
export { themePluginBridge } from "./theme/ThemePluginBridge";
export type { ThemeVariable, ThemeOverrides } from "./theme/ThemePluginBridge";
export { validateManifest } from "./manifestValidator";
export type { ValidatedManifest } from "./manifestValidator";
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
