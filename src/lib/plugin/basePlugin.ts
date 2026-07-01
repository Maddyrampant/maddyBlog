import type { ReactNode } from "react";
import type {
  Plugin,
  PluginManifest,
  PluginHook,
  PluginPermission,
  HookType,
  PluginContext,
} from "./types";
import type { ApiRouter } from "./types";

export abstract class BasePlugin implements Plugin {
  abstract manifest: PluginManifest;
  hooks?: PluginHook[];

  onInstall?(): Promise<void>;
  onActivate?(): Promise<void>;
  onDeactivate?(): Promise<void>;
  onUninstall?(): Promise<void>;

  protected registerHook(hook: PluginHook): void {
    if (!this.hooks) {
      this.hooks = [];
    }
    this.hooks.push(hook);
  }

  protected addUiHook(
    hook:
      | "injectAdminSidebar"
      | "injectPostView"
      | "injectPostHeader"
      | "injectPostFooter"
      | "injectProfilePage",
    component: () => ReactNode,
  ): void {
    this.registerHook({
      type: "ui",
      hook,
      component,
    });
  }

  protected addDataHook(
    hook: HookType,
    handler: (data: unknown, context: PluginContext) => unknown,
  ): void {
    this.registerHook({
      type: "data",
      hook,
      handler,
    });
  }

  protected addApiHook(handler: (router: ApiRouter) => void): void {
    this.registerHook({
      type: "api",
      hook: "registerRoutes",
      handler,
    });
  }

  validatePermissions(required: PluginPermission[]): boolean {
    for (const perm of required) {
      if (!this.manifest.permissions.includes(perm)) {
        return false;
      }
    }
    return true;
  }
}
