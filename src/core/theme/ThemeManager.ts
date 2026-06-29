import type {
  ThemeComponentName,
  ThemeEntry,
  ThemeConfigValues,
  ThemeManifest,
} from "./ThemeTypes";
import { themeRegistry } from "./ThemeRegistry";
import { themeLoader } from "./ThemeLoader";

const DEFAULT_MANIFEST: ThemeManifest = {
  name: "default",
  version: "1.0.0",
  author: "maddyBlog",
  description: "The default theme for maddyBlog — clean, minimal, responsive.",
  supportedFeatures: [
    "author-card",
    "related-posts",
    "sidebar",
    "newsletter",
    "search",
    "categories",
    "tags",
    "reading-time",
    "dark-mode",
  ],
  configurationSchema: {
    fields: [
      {
        key: "primaryColor",
        label: "Primary Color",
        type: "color",
        defaultValue: "#6366f1",
      },
      {
        key: "fontFamily",
        label: "Font Family",
        type: "font",
        defaultValue: "Inter",
        options: [
          { label: "Inter", value: "Inter" },
          { label: "Georgia", value: "Georgia" },
          { label: "System UI", value: "system-ui" },
        ],
      },
      {
        key: "layout",
        label: "Layout Style",
        type: "select",
        defaultValue: "classic",
        options: [
          { label: "Classic", value: "classic" },
          { label: "Compact", value: "compact" },
          { label: "Magazine", value: "magazine" },
        ],
      },
      {
        key: "showAuthorBox",
        label: "Show Author Box",
        type: "boolean",
        defaultValue: true,
      },
      {
        key: "showReadingTime",
        label: "Show Reading Time",
        type: "boolean",
        defaultValue: true,
      },
      {
        key: "showRelatedPosts",
        label: "Show Related Posts",
        type: "boolean",
        defaultValue: true,
      },
      {
        key: "maxPostsPerPage",
        label: "Posts Per Page",
        type: "number",
        defaultValue: 9,
      },
    ],
    groups: [
      {
        label: "Appearance",
        key: "appearance",
        fields: ["primaryColor", "fontFamily", "layout"],
      },
      {
        label: "Content",
        key: "content",
        fields: [
          "showAuthorBox",
          "showReadingTime",
          "showRelatedPosts",
          "maxPostsPerPage",
        ],
      },
    ],
  },
};

const DEFAULT_CONFIG: ThemeConfigValues = {
  primaryColor: "#6366f1",
  fontFamily: "Inter",
  layout: "classic",
  showAuthorBox: true,
  showReadingTime: true,
  showRelatedPosts: true,
  maxPostsPerPage: 9,
};

class ThemeManager {
  private entries = new Map<string, ThemeEntry>();
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;
    await this.discoverThemes();
    this.initialized = true;
  }

  private async discoverThemes(): Promise<void> {
    if (!this.entries.has("default")) {
      const entry: ThemeEntry = {
        manifest: DEFAULT_MANIFEST,
        status: "inactive",
        config: DEFAULT_CONFIG,
        installedAt: new Date(),
        directory: "themes/default",
      };
      this.entries.set("default", entry);
      themeRegistry.register(
        "default",
        "themes/default",
        DEFAULT_MANIFEST,
        DEFAULT_CONFIG,
      );
    }
  }

  async activate(name: string): Promise<boolean> {
    const entry = this.entries.get(name);
    if (!entry) return false;
    if (entry.status === "active") return true;

    try {
      const components = await themeLoader.loadThemeComponents(
        entry.directory,
        entry.manifest,
      );

      if (components.length === 0) {
        entry.status = "error";
        entry.error = "No valid components found";
        themeRegistry.updateStatus(name, "error", entry.error);
        return false;
      }

      entry.status = "active";
      themeRegistry.updateStatus(name, "active");
      themeRegistry.setActive(name);

      return true;
    } catch (error) {
      entry.status = "error";
      entry.error =
        error instanceof Error ? error.message : "Activation failed";
      themeRegistry.updateStatus(name, "error", entry.error);
      return false;
    }
  }

  async deactivate(name: string): Promise<boolean> {
    const entry = this.entries.get(name);
    if (!entry || entry.status !== "active") return false;

    entry.status = "inactive";
    themeRegistry.updateStatus(name, "inactive");
    themeLoader.clearCache(entry.directory);

    return true;
  }

  async install(
    directory: string,
    manifest: ThemeManifest,
    config?: ThemeConfigValues,
  ): Promise<boolean> {
    if (this.entries.has(manifest.name)) return false;

    const entry: ThemeEntry = {
      manifest,
      status: "inactive",
      config: config ?? {},
      installedAt: new Date(),
      directory,
    };

    this.entries.set(manifest.name, entry);
    themeRegistry.register(manifest.name, directory, manifest, config);
    return true;
  }

  async uninstall(name: string): Promise<boolean> {
    if (name === "default") return false;

    const entry = this.entries.get(name);
    if (!entry) return false;

    if (entry.status === "active") {
      await this.deactivate(name);
    }

    this.entries.delete(name);
    themeRegistry.unregister(name);
    themeLoader.clearCache(entry.directory);

    return true;
  }

  async resolveComponent(
    componentName: ThemeComponentName,
  ): Promise<React.ComponentType<unknown> | null> {
    const activeEntry = themeRegistry.getActiveEntry();
    if (!activeEntry) return null;

    return themeLoader.resolveComponent(activeEntry.directory, componentName);
  }

  async getActiveComponent(
    componentName: ThemeComponentName,
  ): Promise<React.ComponentType<unknown> | null> {
    return this.resolveComponent(componentName);
  }

  isActive(name: string): boolean {
    return this.entries.get(name)?.status === "active";
  }

  getEntry(name: string): ThemeEntry | undefined {
    return this.entries.get(name);
  }

  getEntries(): Map<string, ThemeEntry> {
    return this.entries;
  }

  getActiveEntry(): ThemeEntry | undefined {
    const activeName = themeRegistry.getActiveThemeName();
    if (!activeName) return undefined;
    return this.entries.get(activeName);
  }

  updateConfig(name: string, config: ThemeConfigValues): void {
    const entry = this.entries.get(name);
    if (entry) {
      entry.config = { ...entry.config, ...config };
      themeRegistry.updateConfig(name, config);
    }
  }

  getConfig(name: string): ThemeConfigValues | undefined {
    return this.entries.get(name)?.config;
  }

  getActiveConfig(): ThemeConfigValues | undefined {
    const active = this.getActiveEntry();
    return active?.config;
  }
}

export const themeManager = new ThemeManager();
