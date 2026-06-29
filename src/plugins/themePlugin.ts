import type { Plugin, PluginManifest } from "@/lib/plugin";
import { themeManager } from "@/core/theme";

const manifest: PluginManifest = {
  name: "theme-system",
  version: "1.0.0",
  description:
    "Core theme system — manages theme loading, activation, and configuration",
  author: "maddyBlog",
  permissions: ["MANAGE_PLUGINS"],
  hooks: [],
};

export const plugin: Plugin = {
  manifest,
  hooks: [],

  async onActivate(): Promise<void> {
    await themeManager.initialize();
    const activeTheme = themeManager.getActiveEntry();
    if (!activeTheme) {
      await themeManager.activate("default");
    }
  },

  async onDeactivate(): Promise<void> {
    await themeManager.deactivate(
      themeManager.getActiveEntry()?.manifest.name ?? "default",
    );
  },
};
