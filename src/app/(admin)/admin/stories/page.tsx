"use client";

import { useState, useEffect } from "react";

type Story = {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string | null;
  author: { username: string; avatarUrl: string | null };
  active: boolean;
  order: number;
  createdAt: string;
  expiresAt: string | null;
};

export default function StoriesAdminPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/stories");
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) setStories(data);
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

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !imageUrl) return;
    try {
      const res = await fetch("/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create", title, imageUrl, linkUrl: linkUrl || undefined }),
      });
      if (res.ok) {
        setTitle("");
        setImageUrl("");
        setLinkUrl("");
        location.reload();
      }
    } catch {
      /* ignore */
    }
  }

  async function handleDelete(id: string) {
    try {
      await fetch("/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id }),
      });
      location.reload();
    } catch {
      /* ignore */
    }
  }

  async function handleMoveUp(index: number) {
    if (index === 0) return;
    const newStories = [...stories];
    [newStories[index - 1], newStories[index]] = [newStories[index], newStories[index - 1]];
    const orders = newStories.map((s, i) => ({ id: s.id, order: i }));
    try {
      await fetch("/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reorder", orders }),
      });
      setStories(newStories);
    } catch {
      /* ignore */
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Stories</h1>

      <form onSubmit={handleCreate} className="mb-10 p-5 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-500">Add New Story</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Story title"
            className="px-3 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-zinc-400"
            required
          />
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Image URL"
            className="px-3 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-zinc-400"
            required
          />
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="Link URL (optional)"
            className="px-3 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-zinc-400"
          />
        </div>
        <button
          type="submit"
          className="px-5 py-2 text-sm font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
        >
          Add Story
        </button>
      </form>

      {loading ? (
        <p className="text-zinc-500">Loading...</p>
      ) : stories.length === 0 ? (
        <p className="text-zinc-500 py-8 text-center">No stories yet. Add one above.</p>
      ) : (
        <div className="space-y-3">
          {stories.map((story, i) => (
            <div
              key={story.id}
              className="flex items-center gap-4 p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg"
            >
              <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 bg-zinc-200 dark:bg-zinc-800">
                <img src={story.imageUrl} alt={story.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{story.title}</p>
                <p className="text-xs text-zinc-500">by {story.author.username}</p>
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
                  onClick={() => handleDelete(story.id)}
                  className="px-2 py-1 text-xs text-red-600 border border-red-300 dark:border-red-800 rounded hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
