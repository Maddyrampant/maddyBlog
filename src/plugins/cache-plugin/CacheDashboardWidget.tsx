"use client";

import { useEffect, useState, useCallback } from "react";

export function CacheDashboardWidget() {
  const [stats, setStats] = useState<{
    size: number;
    hits: number;
    misses: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/plugins/cache/stats");
      if (!res.ok) return;
      const data = await res.json();
      setStats(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const id = setTimeout(() => fetchStats(), 0);
    const interval = setInterval(fetchStats, 10000);
    return () => {
      clearTimeout(id);
      clearInterval(interval);
    };
  }, [fetchStats]);

  const handleClear = async () => {
    try {
      await fetch("/api/plugins/cache/clear", { method: "POST" });
      await fetchStats();
    } catch {
      // ignore
    }
  };

  if (loading) {
    return (
      <div className="admin-card p-5">
        <div className="animate-pulse h-16 bg-zinc-100 dark:bg-zinc-800 rounded" />
      </div>
    );
  }

  if (!stats) return null;

  const total = stats.hits + stats.misses;
  const hitRate = total > 0 ? ((stats.hits / total) * 100).toFixed(1) : "0.0";

  return (
    <div className="admin-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
          Cache
        </h3>
        <button
          onClick={handleClear}
          className="text-xs px-2.5 py-1 rounded-md border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          Clear Cache
        </button>
      </div>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-xl font-bold">{stats.size}</div>
          <div className="text-[10px] text-zinc-400 uppercase tracking-wider mt-0.5">
            Entries
          </div>
        </div>
        <div>
          <div className="text-xl font-bold text-green-600 dark:text-green-400">
            {hitRate}%
          </div>
          <div className="text-[10px] text-zinc-400 uppercase tracking-wider mt-0.5">
            Hit Rate
          </div>
        </div>
        <div>
          <div className="text-xl font-bold">{stats.hits}</div>
          <div className="text-[10px] text-zinc-400 uppercase tracking-wider mt-0.5">
            Hits
          </div>
        </div>
      </div>
    </div>
  );
}
