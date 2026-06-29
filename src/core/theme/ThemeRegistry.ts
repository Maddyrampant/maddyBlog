import type { ThemeEntry, ThemeStatus, ThemeConfigValues } from "./ThemeTypes";

export type ThemeRegistryEntry = {
  name: string;
  directory: string;
  manifest: ThemeEntry["manifest"];
  status: ThemeStatus;
  config: ThemeConfigValues;
  error?: string;
  installedAt: Date;
};

export class ThemeRegistry {
  private themes = new Map<string, ThemeRegistryEntry>();
  private activeTheme: string | null = null;

  register(
    name: string,
    directory: string,
    manifest: ThemeEntry["manifest"],
    config?: ThemeConfigValues,
  ): void {
    this.themes.set(name, {
      name,
      directory,
      manifest,
      status: "inactive",
      config: config ?? this.getDefaultConfig(manifest),
      installedAt: new Date(),
    });
  }

  unregister(name: string): void {
    this.themes.delete(name);
    if (this.activeTheme === name) {
      this.activeTheme = null;
    }
  }

  getEntry(name: string): ThemeRegistryEntry | undefined {
    return this.themes.get(name);
  }

  getAllEntries(): ThemeRegistryEntry[] {
    return Array.from(this.themes.values());
  }

  getActiveEntry(): ThemeRegistryEntry | undefined {
    if (!this.activeTheme) return undefined;
    return this.themes.get(this.activeTheme);
  }

  setActive(name: string): boolean {
    const entry = this.themes.get(name);
    if (!entry || entry.status !== "active") return false;
    this.activeTheme = name;
    return true;
  }

  getActiveThemeName(): string | null {
    return this.activeTheme;
  }

  updateStatus(name: string, status: ThemeStatus, error?: string): void {
    const entry = this.themes.get(name);
    if (entry) {
      entry.status = status;
      if (error) entry.error = error;
    }
  }

  updateConfig(name: string, config: ThemeConfigValues): void {
    const entry = this.themes.get(name);
    if (entry) {
      entry.config = { ...entry.config, ...config };
    }
  }

  has(name: string): boolean {
    return this.themes.has(name);
  }

  getCount(): number {
    return this.themes.size;
  }

  private getDefaultConfig(
    manifest: ThemeEntry["manifest"],
  ): ThemeConfigValues {
    const defaults: ThemeConfigValues = {};
    for (const field of manifest.configurationSchema.fields) {
      defaults[field.key] = field.defaultValue;
    }
    return defaults;
  }
}

export const themeRegistry = new ThemeRegistry();
