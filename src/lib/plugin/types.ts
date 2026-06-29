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
  | "MANAGE_PLUGINS"
  | "USE_AI"
  | "MANAGE_AI";

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

export type AIPromptHook = {
  type: "ai";
  hook: "registerPrompts";
  handler: (
    prompts: Record<
      string,
      {
        system: string;
        userPrompt: string;
        temperature: number;
        maxTokens: number;
      }
    >,
  ) => void;
};

export type PluginHook = DataHook | UiHook | ApiHook | AIPromptHook;

export type PluginLogger = {
  info: (msg: string, meta?: Record<string, unknown>) => void;
  warn: (msg: string, meta?: Record<string, unknown>) => void;
  error: (msg: string, meta?: Record<string, unknown>) => void;
};

export type PluginConfig = {
  get: (key: string) => string | undefined;
  getAll: () => Record<string, string>;
};

export type PluginAuth = {
  getCurrentUserId: () => Promise<string | null>;
  hasRole: (role: string) => Promise<boolean>;
  isAuthenticated: () => Promise<boolean>;
};

export type PluginPrisma = {
  post: {
    findMany: (args?: Record<string, unknown>) => Promise<unknown[]>;
    findUnique: (args: Record<string, unknown>) => Promise<unknown>;
    count: (args?: Record<string, unknown>) => Promise<number>;
  };
  comment: {
    findMany: (args?: Record<string, unknown>) => Promise<unknown[]>;
    count: (args?: Record<string, unknown>) => Promise<number>;
  };
  category: {
    findMany: (args?: Record<string, unknown>) => Promise<unknown[]>;
  };
  tag: {
    findMany: (args?: Record<string, unknown>) => Promise<unknown[]>;
  };
};

export type PluginCoreServices = {
  logger: PluginLogger;
  config: PluginConfig;
  auth: PluginAuth;
  db: PluginPrisma;
};

export type PluginContext = {
  userId?: string;
  userRole?: string;
  requestId?: string;
  services: PluginCoreServices;
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

export type PluginLifecycle = {
  onInstall?: () => Promise<void>;
  onActivate?: () => Promise<void>;
  onDeactivate?: () => Promise<void>;
  onUninstall?: () => Promise<void>;
};

export type Plugin = PluginLifecycle & {
  manifest: PluginManifest;
  hooks?: PluginHook[];
};
