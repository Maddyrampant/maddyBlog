"use client";

import { useState, useEffect } from "react";

type FollowButtonProps = {
  userId: string;
  initialFollowing?: boolean;
};

export default function FollowButton({
  userId,
  initialFollowing = false,
}: FollowButtonProps) {
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!initialFollowing) {
      fetch(`/api/follow?userId=${userId}`)
        .then((r) => r.json())
        .then((data) => setFollowing(data.following))
        .catch(() => {});
    }
  }, [userId, initialFollowing]);

  async function handleClick() {
    setLoading(true);
    try {
      if (following) {
        const res = await fetch(`/api/follow?userId=${userId}`, {
          method: "DELETE",
        });
        if (res.ok) setFollowing(false);
      } else {
        const res = await fetch("/api/follow", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });
        if (res.ok) setFollowing(true);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`px-4 py-1.5 text-sm font-medium rounded-lg border transition-colors disabled:opacity-50 ${
        following
          ? "border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-red-400 hover:text-red-500"
          : "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-900 dark:border-white hover:bg-zinc-800 dark:hover:bg-zinc-200"
      }`}
    >
      {loading ? "…" : following ? "Following" : "Follow"}
    </button>
  );
}
