"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

export default function GameverseSearchBar() {
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
        className="w-40 sm:w-56 px-3 py-1.5 text-sm rounded-lg transition-all font-mono"
        style={{
          border: "1px solid var(--gameverse-border)",
          background: "transparent",
          color: "var(--gameverse-text)",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "var(--gameverse-neon-purple)";
          e.currentTarget.style.boxShadow =
            "0 0 12px var(--gameverse-accent-glow)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "var(--gameverse-border)";
          e.currentTarget.style.boxShadow = "none";
        }}
      />
    </form>
  );
}
