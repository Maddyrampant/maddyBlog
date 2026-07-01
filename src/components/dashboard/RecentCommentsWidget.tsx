"use client";

import { useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";
import Link from "next/link";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Comment = any;

export function RecentCommentsWidget() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/comments")
      .then((r) => r.json())
      .then((data) => setComments(Array.isArray(data) ? data.slice(0, 5) : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="admin-card p-5">
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 bg-zinc-100 dark:bg-zinc-800 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (comments.length === 0) return null;

  return (
    <div className="admin-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare size={16} className="text-zinc-400" />
        <h3 className="font-semibold text-sm">Recent Comments</h3>
        <Link href="/admin/comments" className="ml-auto text-xs text-theme-primary hover:underline">
          View all
        </Link>
      </div>
      <div className="space-y-3">
        {comments.map((c: Comment) => (
          <div key={c.id} className="flex items-start gap-3 text-sm">
            <div className="admin-avatar w-7 h-7 text-[10px] shrink-0">
              {c.author?.username?.charAt(0)?.toUpperCase() || "?"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-xs">{c.author?.username}</p>
              <p className="truncate text-zinc-500 text-xs">{c.content}</p>
            </div>
            <span className="text-[10px] text-zinc-400 whitespace-nowrap">
              {new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
