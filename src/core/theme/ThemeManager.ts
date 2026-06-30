import type {
  ThemeComponentName,
  ThemeEntry,
  ThemeConfigValues,
  ThemeManifest,
  ThemeStatus,
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

import {
  manifest as MadelinManifest,
  defaultConfig as MadelinConfig,
} from "@/themes/madelin/theme.config";

import {
  manifest as ZoomjiManifest,
  defaultConfig as ZoomjiConfig,
} from "@/themes/zoomji/theme.config";

const DEFAULT_CONFIG: ThemeConfigValues = {
  primaryColor: "#6366f1",
  fontFamily: "Inter",
  layout: "classic",
  showAuthorBox: true,
  showReadingTime: true,
  showRelatedPosts: true,
  maxPostsPerPage: 9,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let prismaClient: any = null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getPrisma(): Promise<any | null> {
  if (typeof window !== "undefined") return null;
  if (prismaClient) return prismaClient;
  try {
    const mod = await import("@/lib/prisma");
    prismaClient = mod.prisma;
    return prismaClient;
  } catch {
    return null;
  }
}

class ThemeManager {
  private entries = new Map<string, ThemeEntry>();
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;
    await this.discoverThemes();
    this.initialized = true;
  }

  private async discoverThemes(): Promise<void> {
    const prisma = await getPrisma();
    if (prisma) {
      try {
        const dbThemes = await prisma.theme.findMany();
        if (dbThemes.length > 0) {
          for (const t of dbThemes) {
            const config = this.safeParseConfig(t.config);
            const entry: ThemeEntry = {
              manifest: DEFAULT_MANIFEST,
              status: this.toThemeStatus(t.status),
              config,
              installedAt: t.installedAt,
              directory: t.directory,
            };
            this.entries.set(t.name, entry);
            themeRegistry.register(
              t.name,
              t.directory,
              DEFAULT_MANIFEST,
              config,
            );
            themeRegistry.updateStatus(t.name, this.toThemeStatus(t.status));
            if (t.status === "active") {
              themeRegistry.setActive(t.name);
            }
          }
          return;
        }
      } catch {
        // DB unreachable — fall through to in-memory seed
      }
    }

    if (!this.entries.has("default")) {
      this.seedDefaultInMemory();
    }
    if (!this.entries.has("madelin")) {
      this.seedMadelinInMemory();
    }
    if (!this.entries.has("zoomji")) {
      this.seedZoomjiInMemory();
    }
  }

  private seedDefaultInMemory(): void {
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

  private seedMadelinInMemory(): void {
    const entry: ThemeEntry = {
      manifest: MadelinManifest,
      status: "inactive",
      config: MadelinConfig,
      installedAt: new Date(),
      directory: "themes/madelin",
    };
    this.entries.set("madelin", entry);
    themeRegistry.register(
      "madelin",
      "themes/madelin",
      MadelinManifest,
      MadelinConfig,
    );
  }

  private seedZoomjiInMemory(): void {
    const entry: ThemeEntry = {
      manifest: ZoomjiManifest,
      status: "inactive",
      config: ZoomjiConfig,
      installedAt: new Date(),
      directory: "themes/zoomji",
    };
    this.entries.set("zoomji", entry);
    themeRegistry.register(
      "zoomji",
      "themes/zoomji",
      ZoomjiManifest,
      ZoomjiConfig,
    );
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
        await this.persistStatus(name, "error");
        return false;
      }

      entry.status = "active";
      themeRegistry.updateStatus(name, "active");
      themeRegistry.setActive(name);
      await this.persistStatus(name, "active");

      return true;
    } catch (error) {
      entry.status = "error";
      entry.error =
        error instanceof Error ? error.message : "Activation failed";
      themeRegistry.updateStatus(name, "error", entry.error);
      await this.persistStatus(name, "error");
      return false;
    }
  }

  async deactivate(name: string): Promise<boolean> {
    const entry = this.entries.get(name);
    if (!entry || entry.status !== "active") return false;

    entry.status = "inactive";
    themeRegistry.updateStatus(name, "inactive");
    themeLoader.clearCache(entry.manifest.name);
    await this.persistStatus(name, "inactive");

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

    const hasComponents = await themeLoader.resolveComponent(
      manifest.name,
      "Layout",
    );
    if (!hasComponents) {
      console.warn(
        `Theme '${manifest.name}' installed but no components registered in ThemeLoader. ` +
          `Components must be registered via registerThemeModules() before the theme can resolve.`,
      );
    }

    await this.persistTheme({
      name: manifest.name,
      directory,
      version: manifest.version,
      author: manifest.author,
      description: manifest.description,
      status: "inactive",
      config: JSON.stringify(config ?? {}),
      installedAt: entry.installedAt,
    });

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
    themeLoader.clearCache(entry.manifest.name);

    const prisma = await getPrisma();
    if (prisma) {
      try {
        await prisma.theme.delete({ where: { name } });
      } catch {
        // Non-critical
      }
    }

    return true;
  }

  async resolveComponent(
    componentName: ThemeComponentName,
  ): Promise<React.ComponentType<unknown> | null> {
    const activeEntry = themeRegistry.getActiveEntry();
    if (!activeEntry) return null;

    return themeLoader.resolveComponent(
      activeEntry.manifest.name,
      componentName,
    );
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

  async updateConfig(name: string, config: ThemeConfigValues): Promise<void> {
    const entry = this.entries.get(name);
    if (entry) {
      entry.config = { ...entry.config, ...config };
      themeRegistry.updateConfig(name, config);
      await this.persistConfig(name, entry.config);
    }
  }

  getConfig(name: string): ThemeConfigValues | undefined {
    return this.entries.get(name)?.config;
  }

  getActiveConfig(): ThemeConfigValues | undefined {
    const active = this.getActiveEntry();
    return active?.config;
  }

  // ─── Prisma Persistence Helpers ────────────────────────────────────

  private async persistStatus(
    name: string,
    status: ThemeStatus,
  ): Promise<void> {
    const prisma = await getPrisma();
    if (!prisma) return;
    try {
      await prisma.theme.upsert({
        where: { name },
        update: { status },
        create: this.buildCreateInput(name, status),
      });
    } catch {
      // Non-critical — in-memory state is still correct
    }
  }

  private async persistConfig(
    name: string,
    config: ThemeConfigValues,
  ): Promise<void> {
    const prisma = await getPrisma();
    if (!prisma) return;
    try {
      await prisma.theme.upsert({
        where: { name },
        update: { config: JSON.stringify(config) },
        create: this.buildCreateInput(name, "inactive", config),
      });
    } catch {
      // Non-critical
    }
  }

  private async persistTheme(data: {
    name: string;
    directory: string;
    version: string;
    author: string;
    description: string;
    status: string;
    config: string;
    installedAt: Date;
  }): Promise<void> {
    const prisma = await getPrisma();
    if (!prisma) return;
    try {
      await prisma.theme.upsert({
        where: { name: data.name },
        update: {
          directory: data.directory,
          version: data.version,
          author: data.author,
          description: data.description,
          status: data.status,
          config: data.config,
        },
        create: data,
      });
    } catch {
      // Non-critical
    }
  }

  private buildCreateInput(
    name: string,
    status: ThemeStatus,
    config?: ThemeConfigValues,
  ) {
    const entry = this.entries.get(name);
    return {
      name,
      directory: entry?.directory ?? "themes/default",
      version: entry?.manifest.version ?? DEFAULT_MANIFEST.version,
      author: entry?.manifest.author ?? DEFAULT_MANIFEST.author,
      description: entry?.manifest.description ?? DEFAULT_MANIFEST.description,
      status,
      config: JSON.stringify(config ?? entry?.config ?? DEFAULT_CONFIG),
    };
  }

  private toThemeStatus(raw: string): ThemeStatus {
    if (raw === "active" || raw === "error") return raw;
    return "inactive";
  }

  private safeParseConfig(raw: string): ThemeConfigValues {
    try {
      return JSON.parse(raw) as ThemeConfigValues;
    } catch {
      return { ...DEFAULT_CONFIG };
    }
  }
}

export const themeManager = new ThemeManager();
