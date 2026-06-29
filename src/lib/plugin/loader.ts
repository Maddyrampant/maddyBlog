import type { Plugin, PluginEntry } from "./types";

const BUILTIN_PLUGINS: Array<
  () => Promise<{ plugin?: Plugin; default?: Plugin }>
> = [];

export function registerBuiltinPlugin(
  loader: () => Promise<{ plugin?: Plugin; default?: Plugin }>,
): void {
  BUILTIN_PLUGINS.push(loader);
}

export async function loadBuiltinPlugins(): Promise<PluginEntry[]> {
  const entries: PluginEntry[] = [];

  for (const loader of BUILTIN_PLUGINS) {
    try {
      const mod = await loader();
      const plugin = mod.plugin || mod.default;
      if (!plugin || !plugin.manifest?.name) continue;
      entries.push({ plugin, status: "inactive" });
    } catch {
      // individual plugin load failure is non-fatal
    }
  }

  return entries;
}

export async function loadPlugin(pluginPath: string): Promise<PluginEntry> {
  try {
    const mod = await import(pluginPath);
    const plugin = mod.plugin || mod.default;
    if (!plugin || !plugin.manifest?.name) {
      return {
        plugin: null as unknown as Plugin,
        status: "error",
        error: "Invalid plugin: missing manifest or name",
      };
    }
    return { plugin, status: "inactive" };
  } catch (error) {
    return {
      plugin: null as unknown as Plugin,
      status: "error",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
