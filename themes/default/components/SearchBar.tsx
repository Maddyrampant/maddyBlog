"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

export default function DefaultSearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      }
    },
    [query, router],
  );

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        className="w-40 sm:w-56 px-3 py-1.5 text-sm border border-zinc-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-500"
      />
    </form>
  );
}
