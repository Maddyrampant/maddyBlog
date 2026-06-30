"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

export default function ZoomgSearchBar() {
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
        placeholder="جستجو..."
        className="zoomg-input w-full text-sm"
        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--zoomg-accent)")}
        onBlur={(e) => (e.currentTarget.style.borderColor = "var(--zoomg-border)")}
      />
    </form>
  );
}
