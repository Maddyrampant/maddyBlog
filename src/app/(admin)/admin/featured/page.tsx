"use client";

import { useState, useEffect } from "react";

type FeaturedPost = {
  id: string;
  title: string;
  slug: string;
  featuredOrder: number;
  author: { username: string };
  category: { name: string; slug: string } | null;
  _count: { comments: number };
};

export default function FeaturedAdminPage() {
  const [featured, setFeatured] = useState<FeaturedPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/featured");
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) setFeatured(data.posts || []);
        }
      } catch {
        /* ignore */
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  async function handleToggle(postId: string, isCurrentlyFeatured: boolean) {
    try {
      await fetch("/api/featured", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, action: isCurrentlyFeatured ? "remove" : "add" }),
      });
      location.reload();
    } catch {
      /* ignore */
    }
  }

  async function handleMoveUp(index: number) {
    if (index === 0) return;
    const newFeatured = [...featured];
    [newFeatured[index - 1], newFeatured[index]] = [newFeatured[index], newFeatured[index - 1]];
    const orders = newFeatured.map((p, i) => ({ id: p.id, order: i }));
    try {
      await fetch("/api/featured", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reorder", orders }),
      });
      setFeatured(newFeatured);
    } catch {
      /* ignore */
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Featured Posts</h1>

      {loading ? (
        <p className="text-zinc-500">Loading...</p>
      ) : featured.length === 0 ? (
        <p className="text-zinc-500 py-8 text-center">
          No featured posts. Edit a post and mark it as featured.
        </p>
      ) : (
        <div className="space-y-3">
          {featured.map((post, i) => (
            <div
              key={post.id}
              className="flex items-center gap-4 p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg"
            >
              <span className="text-lg font-bold text-zinc-300 w-6 text-right shrink-0">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{post.title}</p>
                <p className="text-xs text-zinc-500">
                  by {post.author.username}
                  {post.category && <> &middot; {post.category.name}</>}
                  <>&middot;</> {post._count.comments} comments
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleMoveUp(i)}
                  disabled={i === 0}
                  className="px-2 py-1 text-xs border border-zinc-300 dark:border-zinc-700 rounded disabled:opacity-30 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Move Up
                </button>
                <button
                  onClick={() => handleToggle(post.id, true)}
                  className="px-2 py-1 text-xs text-red-600 border border-red-300 dark:border-red-800 rounded hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
