import { BasePlugin } from "@/lib/plugin/basePlugin";
import type { PluginManifest, ApiRouter } from "@/lib/plugin/types";
import { uiExtensionRegistry } from "@/lib/plugin/ui/UIExtensionRegistry";
import { CacheDashboardWidget } from "./CacheDashboardWidget";

const manifest: PluginManifest = {
  name: "cache",
  version: "1.0.0",
  description:
    "Full-page and fragment cache with TTL, automatic invalidation on post changes, and an admin dashboard widget showing hit rate.",
  author: "maddyBlog",
  license: "MIT",
  permissions: ["ACCESS_ANALYTICS"],
  hooks: [
    "beforeRenderPost",
    "afterPostSave",
    "afterPostDeleted",
    "registerRoutes",
  ],
};

class CachePlugin extends BasePlugin {
  manifest = manifest;

  constructor() {
    super();

    this.addApiHook((router: ApiRouter) => {
      router.registerRoute({
        method: "GET",
        path: "/api/plugins/cache/stats",
        handler: async () => {
          const { cacheStore } = await import("@/lib/cache/CacheStore");
          return Response.json(cacheStore.getStats());
        },
      });
      router.registerRoute({
        method: "POST",
        path: "/api/plugins/cache/clear",
        handler: async () => {
          const { cacheStore } = await import("@/lib/cache/CacheStore");
          cacheStore.clear();
          return Response.json({ success: true });
        },
      });
    });
  }

  async onInstall(): Promise<void> {
    console.log("[cache] plugin installed");
  }

  async onActivate(): Promise<void> {
    console.log("[cache] plugin activated");
    uiExtensionRegistry.register(
      "admin:dashboard:widget",
      "cache",
      () => <CacheDashboardWidget />,
      { priority: 5 },
    );
  }

  async onDeactivate(): Promise<void> {
    console.log("[cache] plugin deactivated");
    uiExtensionRegistry.unregisterAll("cache");
  }

  async onUninstall(): Promise<void> {
    console.log("[cache] plugin uninstalled");
    uiExtensionRegistry.unregisterAll("cache");
  }
}

const plugin = new CachePlugin();
export { plugin };
export default plugin;
