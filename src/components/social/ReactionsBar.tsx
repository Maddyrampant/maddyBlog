"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ThumbsUp, Flame, Clapperboard } from "lucide-react";

const REACTION_ICONS: Record<string, React.ReactNode> = {
  LIKE: <ThumbsUp size={18} />,
  FIRE: <Flame size={18} />,
  CLAP: <Clapperboard size={18} />,
};

const REACTION_LABELS: Record<string, string> = {
  LIKE: "Like",
  FIRE: "Fire",
  CLAP: "Clap",
};

type ReactionCounts = Record<string, number>;

export function ReactionsBar({ postId }: { postId: string }) {
  const router = useRouter();
  const [counts, setCounts] = useState<ReactionCounts>({ LIKE: 0, FIRE: 0, CLAP: 0 });
  const [userReactions, setUserReactions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/reactions?postId=${postId}`)
      .then((r) => r.ok && r.json())
      .then((data) => {
        if (data) {
          setCounts(data.counts);
          setUserReactions(data.userReactions);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [postId]);

  const handleReact = async (type: string) => {
    const res = await fetch("/api/reactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, type }),
    });

    if (res.status === 401) {
      router.push("/login");
      return;
    }

    if (res.ok) {
      const data = await res.json();
      setCounts((prev) => ({
        ...prev,
        [type]: Math.max(0, prev[type] + (data.reacted ? 1 : -1)),
      }));
      setUserReactions((prev) =>
        data.reacted
          ? [...prev, type]
          : prev.filter((r) => r !== type),
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-6 py-6 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-20 h-9 bg-zinc-100 dark:bg-zinc-800 rounded-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-3 py-6">
      {Object.keys(REACTION_ICONS).map((type) => (
        <button
          key={type}
          onClick={() => handleReact(type)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            userReactions.includes(type)
              ? "bg-theme-primary/10 text-theme-primary border border-theme-primary/30 shadow-sm"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-transparent hover:bg-zinc-200 dark:hover:bg-zinc-700"
          }`}
        >
          {REACTION_ICONS[type]}
          <span>{counts[type] || 0}</span>
          <span className="hidden sm:inline ml-0.5 text-xs opacity-70">
            {REACTION_LABELS[type]}
          </span>
        </button>
      ))}
    </div>
  );
}
