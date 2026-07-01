"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

export default function PersonalBlogSearchBar() {
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
        className="w-40 sm:w-56 px-3 py-1.5 text-sm rounded-lg transition-all"
        style={{
          border: "1px solid var(--personalblog-border)",
          background: "transparent",
          color: "var(--personalblog-text)",
        }}
        onFocus={(e) =>
          (e.currentTarget.style.borderColor = "var(--personalblog-accent)")
        }
        onBlur={(e) =>
          (e.currentTarget.style.borderColor = "var(--personalblog-border)")
        }
      />
    </form>
  );
}
