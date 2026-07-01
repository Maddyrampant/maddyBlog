"use client";

import { useEffect, useState } from "react";
import { Activity, Database, Server } from "lucide-react";

type HealthInfo = {
  status: string;
  uptime: number;
  database: string;
  memory: string;
};

export function SystemHealthWidget() {
  const [health, setHealth] = useState<HealthInfo | null>(null);

  useEffect(() => {
    fetch("/api/health")
      .then((r) => r.json())
      .then(setHealth)
      .catch(() => {});
  }, []);

  if (!health) return null;

  const formatUptime = (seconds: number) => {
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${d}d ${h}h ${m}m`;
  };

  return (
    <div className="admin-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Activity size={16} className="text-zinc-400" />
        <h3 className="font-semibold text-sm">System Health</h3>
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <Server size={14} className="text-zinc-400 shrink-0" />
          <span className="text-zinc-500 text-xs">Server</span>
          <span className="ml-auto text-xs font-medium flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full ${health.status === "ok" ? "bg-green-500" : "bg-red-500"}`} />
            {health.status === "ok" ? "Healthy" : "Unhealthy"}
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Database size={14} className="text-zinc-400 shrink-0" />
          <span className="text-zinc-500 text-xs">Database</span>
          <span className="ml-auto text-xs font-medium flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full ${health.database === "connected" ? "bg-green-500" : "bg-red-500"}`} />
            {health.database}
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Activity size={14} className="text-zinc-400 shrink-0" />
          <span className="text-zinc-500 text-xs">Uptime</span>
          <span className="ml-auto text-xs font-medium">{formatUptime(health.uptime)}</span>
        </div>
      </div>
    </div>
  );
}
