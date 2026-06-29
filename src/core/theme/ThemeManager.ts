import type {
  ThemeComponentName,
  ThemeEntry,
  ThemeConfigValues,
  ThemeManifest,
} from "./ThemeTypes";
import { themeRegistry } from "./ThemeRegistry";
import { themeLoader } from "./ThemeLoader";

class ThemeManager {
  private entries = new Map<string, ThemeEntry>();
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;
    await this.discoverThemes();
    this.initialized = true;
  }

  private async discoverThemes(): Promise<void> {
    const builtinTheme = await this.loadThemeFromDirectory("themes/default");
    if (builtinTheme) {
      const name = builtinTheme.manifest.name;
      this.entries.set(name, builtinTheme);
      themeRegistry.register(
        name,
        builtinTheme.directory,
        builtinTheme.manifest,
        builtinTheme.config,
      );
    }
  }

  private async loadThemeFromDirectory(
    directory: string,
  ): Promise<ThemeEntry | null> {
    try {
      const mod = await import(
        /* @vite-ignore */ `@/${directory}/theme.config`
      );
      const manifest: ThemeManifest = mod.manifest;
      const defaultConfig: ThemeConfigValues = mod.defaultConfig ?? {};

      if (!manifest?.name) return null;

      return {
        manifest,
        status: "inactive",
        config: defaultConfig,
        installedAt: new Date(),
        directory,
      };
    } catch {
      return null;
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
