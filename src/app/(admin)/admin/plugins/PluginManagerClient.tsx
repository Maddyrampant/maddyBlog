"use client";

import { useEffect, useState, useCallback } from "react";
import { Check, X, Power, PowerOff, Trash2, Puzzle } from "lucide-react";

type PluginInfo = {
  dir: string;
  name: string;
  version: string;
  description: string;
  author: string;
  status: string;
  error: string | null;
  permissions: string[];
};

export default function PluginManagerClient() {
  const [plugins, setPlugins] = useState<PluginInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch("/api/plugins");
        if (!res.ok) throw new Error("Failed to fetch plugins");
        const data = await res.json();
        if (mounted) setPlugins(data.plugins);
      } catch (err) {
        if (mounted)
          setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const fetchPlugins = useCallback(async () => {
    try {
      const res = await fetch("/api/plugins");
      if (!res.ok) throw new Error("Failed to fetch plugins");
      const data = await res.json();
      setPlugins(data.plugins);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }, []);

  async function handleAction(name: string, action: string) {
    try {
      const res = await fetch("/api/plugins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, action }),
      });
      if (!res.ok) throw new Error("Action failed");
      await fetchPlugins();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed");
    }
  }

  if (loading) {
    return (
      <div className="admin-card p-12 text-center">
        <div className="animate-spin w-6 h-6 border-2 border-theme-primary border-t-transparent rounded-full mx-auto" />
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="underline text-xs">
            Dismiss
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {plugins.map((plugin) => (
          <div
            key={plugin.name}
            className={`admin-card overflow-hidden ${
              plugin.status === "active" ? "ring-2 ring-theme-primary" : ""
            }`}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${
                      plugin.status === "active"
                        ? "gradient-primary"
                        : "bg-zinc-100 dark:bg-zinc-800"
                    }`}
                  >
                    <Puzzle
                      size={22}
                      className={
                        plugin.status === "active"
                          ? "text-white"
                          : "text-zinc-400"
                      }
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold">{plugin.name}</h3>
                      {plugin.status === "active" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                          <Check size={10} />
                          Active
                        </span>
                      )}
                      {plugin.status === "error" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                          <X size={10} />
                          Error
                        </span>
                      )}
                      {plugin.status === "inactive" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      v{plugin.version}
                      {plugin.author ? ` by ${plugin.author}` : ""}
                    </p>
                  </div>
                </div>
              </div>

              {plugin.description && (
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed">
                  {plugin.description}
                </p>
              )}

              {plugin.error && (
                <p className="text-xs text-red-500 mb-4 bg-red-50 dark:bg-red-950/50 p-3 rounded-lg">
                  {plugin.error}
                </p>
              )}

              {plugin.permissions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {plugin.permissions.map((perm) => (
                    <span
                      key={perm}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 font-medium"
                    >
                      {perm}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                {plugin.status !== "active" && plugin.status !== "error" && (
                  <button
                    onClick={() => handleAction(plugin.name, "activate")}
                    className="admin-btn admin-btn-primary admin-btn-sm"
                  >
                    <Power size={14} />
                    Activate
                  </button>
                )}
                {plugin.status === "active" && (
                  <button
                    onClick={() => handleAction(plugin.name, "deactivate")}
                    className="admin-btn admin-btn-outline admin-btn-sm"
                  >
                    <PowerOff size={14} />
                    Deactivate
                  </button>
                )}
                {plugin.name !== "theme-system" && (
                  <button
                    onClick={() => {
                      if (confirm(`Uninstall plugin "${plugin.name}"?`)) {
                        handleAction(plugin.name, "uninstall");
                      }
                    }}
                    className="admin-btn admin-btn-sm admin-btn-danger ml-auto"
                  >
                    <Trash2 size={14} />
                    Uninstall
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {plugins.length === 0 && (
        <div className="admin-card p-12 text-center">
          <Puzzle
            size={40}
            className="mx-auto text-zinc-200 dark:text-zinc-700 mb-4"
          />
          <p className="text-zinc-500 font-medium">No plugins installed</p>
          <p className="text-sm text-zinc-400 mt-1">
            Plugins extend your blog functionality.
          </p>
        </div>
      )}
    </div>
  );
}
