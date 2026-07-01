"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

type Story = {
  id: string;
  title: string;
  slug: string;
  coverImage: string | null;
  category?: string;
};

export function StoriesBar({ stories }: { stories: Story[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;
  if (stories.length === 0) return null;

  const displayed = stories.slice(0, 8);

  return (
    <div className="w-full overflow-x-auto py-4 scrollbar-hide">
      <div className="flex gap-4 min-w-max px-1">
        {displayed.map((story) => (
          <Link
            key={story.id}
            href={`/posts/${story.slug}`}
            className="flex flex-col items-center gap-2 group w-20 flex-shrink-0"
          >
            <div className="relative w-16 h-16 rounded-full ring-2 ring-[var(--story-ring,#6366f1)] ring-offset-2 overflow-hidden transition-transform group-hover:scale-105">
              {story.coverImage ? (
                <Image
                  src={story.coverImage}
                  alt={story.title}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold">
                  {story.title.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <span className="text-xs text-center line-clamp-2 w-full text-[var(--story-text,#6b7280)]">
              {story.category || story.title}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
