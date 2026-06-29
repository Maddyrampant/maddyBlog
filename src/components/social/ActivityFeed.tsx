"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Activity = {
  id: string;
  type: string;
  message: string;
  link: string | null;
  createdAt: string;
  user: { username: string; avatarUrl: string | null };
};

export default function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/feed?pageSize=20")
      .then((r) => r.json())
      .then((data) => setActivities(data.activities || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-sm text-zinc-500">Loading feed…</p>;
  }

  if (activities.length === 0) {
    return (
      <p className="text-sm text-zinc-500 py-8 text-center">
        No recent activity. Follow some authors to see their updates.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex-shrink-0 flex items-center justify-center text-xs font-medium">
            {activity.user.username[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            {activity.link ? (
              <Link
                href={activity.link}
                className="text-sm text-zinc-700 dark:text-zinc-300 hover:text-blue-600 transition-colors"
              >
                <span className="font-medium">{activity.user.username}</span>{" "}
                {activity.message}
              </Link>
            ) : (
              <p className="text-sm text-zinc-700 dark:text-zinc-300">
                <span className="font-medium">{activity.user.username}</span>{" "}
                {activity.message}
              </p>
            )}
            <p className="text-xs text-zinc-400 mt-0.5">
              {getRelativeTime(new Date(activity.createdAt))}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function getRelativeTime(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}
