import type { ReactNode } from "react";

export type PluginPermission =
  | "READ_POST"
  | "WRITE_POST"
  | "DELETE_POST"
  | "READ_USER"
  | "WRITE_USER"
  | "MANAGE_COMMENTS"
  | "SEND_EMAIL"
  | "ACCESS_ANALYTICS"
  | "MANAGE_PLUGINS";

export type PluginManifest = {
  name: string;
  version: string;
  description: string;
  author: string;
  license?: string;
  dependencies?: string[];
  permissions: PluginPermission[];
  hooks: string[];
};

export type HookType =
  | "beforePostSave"
  | "afterPostSave"
  | "afterPostDeleted"
  | "beforeCommentCreate"
  | "afterCommentCreated"
  | "afterCommentDeleted"
  | "beforeUserRegister"
  | "afterUserRegister"
  | "beforeRenderPost"
  | "afterRenderPost";

export type DataHook<T = unknown> = {
  type: "data";
  hook: HookType;
  handler: (data: T, context: PluginContext) => T | Promise<T>;
};

export type UiHook = {
  type: "ui";
  hook:
    | "injectAdminSidebar"
    | "injectPostView"
    | "injectPostHeader"
    | "injectPostFooter"
    | "injectProfilePage";
  component: () => ReactNode;
};

export type ApiHook = {
  type: "api";
  hook: "registerRoutes";
  handler: (router: ApiRouter) => void;
};

export type PluginHook = DataHook | UiHook | ApiHook;

export type PluginContext = {
  userId?: string;
  userRole?: string;
  requestId?: string;
};

export type Plugin = {
  manifest: PluginManifest;
  onInstall?: () => Promise<void>;
  onActivate?: () => Promise<void>;
  onDeactivate?: () => Promise<void>;
  onUninstall?: () => Promise<void>;
  hooks?: PluginHook[];
};

export type ApiRoute = {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;
  handler: (
    request: Request,
    context: PluginContext,
  ) => Response | Promise<Response>;
};

export type ApiRouter = {
  registerRoute: (route: ApiRoute) => void;
};

export type PluginStatus = "inactive" | "active" | "error";

export type PluginEntry = {
  plugin: Plugin;
  status: PluginStatus;
  error?: string;
};

export type PluginEvent = {
  type: string;
  payload: unknown;
  timestamp: Date;
  source: string;
};

export type EventHandler = (event: PluginEvent) => void | Promise<void>;
