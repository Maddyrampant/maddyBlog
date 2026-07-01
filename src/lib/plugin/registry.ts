import type {
  Plugin,
  PluginManifest,
  PluginPermission,
  PluginStatus,
} from "./types";

export type PluginRegistryEntry = {
  name: string;
  dir: string;
  manifest: PluginManifest;
  status: PluginStatus;
  error?: string;
  installedAt: Date;
};

export class PluginRegistry {
  private entries = new Map<string, PluginRegistryEntry>();
  private pluginMap = new Map<string, Plugin>();

  register(name: string, dir: string, plugin: Plugin): void {
    this.pluginMap.set(name, plugin);
    this.entries.set(name, {
      name,
      dir,
      manifest: plugin.manifest,
      status: "inactive",
      installedAt: new Date(),
    });
  }

  updateStatus(name: string, status: PluginStatus, error?: string): void {
    const entry = this.entries.get(name);
    if (entry) {
      entry.status = status;
      if (error) entry.error = error;
    }
  }

  getPlugin(name: string): Plugin | undefined {
    return this.pluginMap.get(name);
  }

  getEntry(name: string): PluginRegistryEntry | undefined {
    return this.entries.get(name);
  }

  getAllEntries(): PluginRegistryEntry[] {
    return Array.from(this.entries.values());
  }

  getActiveEntries(): PluginRegistryEntry[] {
    return this.getAllEntries().filter((e) => e.status === "active");
  }

  getByCategory(category: string): PluginRegistryEntry[] {
    return this.getAllEntries().filter((e) =>
      e.manifest.hooks.includes(category),
    );
  }

  getByPermission(permission: string): PluginRegistryEntry[] {
    return this.getAllEntries().filter((e) =>
      e.manifest.permissions.includes(permission as PluginPermission),
    );
  }

  has(name: string): boolean {
    return this.entries.has(name);
  }

  unregister(name: string): void {
    this.pluginMap.delete(name);
    this.entries.delete(name);
  }

  getCount(): number {
    return this.entries.size;
  }

  getActiveCount(): number {
    return this.getActiveEntries().length;
  }

  findByName(query: string): PluginRegistryEntry[] {
    return this.getAllEntries().filter(
      (e) =>
        e.name.toLowerCase().includes(query.toLowerCase()) ||
        e.manifest.description.toLowerCase().includes(query.toLowerCase()),
    );
  }
}

export const pluginRegistry = new PluginRegistry();
