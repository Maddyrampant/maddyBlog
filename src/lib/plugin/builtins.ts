import { registerBuiltinPlugin } from "./loader";

export async function registerBuiltinPlugins(): Promise<void> {
  const themePlugin = await import("@/plugins/themePlugin");
  registerBuiltinPlugin(() => Promise.resolve(themePlugin));

  const socialShare = await import("@/plugins/social-share");
  registerBuiltinPlugin(() => Promise.resolve(socialShare));

  const cachePlugin = await import("@/plugins/cache-plugin");
  registerBuiltinPlugin(() => Promise.resolve(cachePlugin));
}
