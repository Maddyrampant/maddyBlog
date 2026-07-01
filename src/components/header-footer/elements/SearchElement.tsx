"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { BuilderElement } from "@/lib/header-footer/types";

type SearchElementProps = {
  element: BuilderElement;
  themeName: string;
};

export default function SearchElement({ themeName }: SearchElementProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-[240px]">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        className="w-full px-3 py-1.5 pr-8 text-sm border rounded-md outline-none"
        style={{
          backgroundColor: `var(--${themeName}-bg, #ffffff)`,
          borderColor: `var(--${themeName}-border, #e4e4e7)`,
          color: `var(--${themeName}-text)`,
        }}
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2"
        style={{ color: `var(--${themeName}-text-muted, #a1a1aa)` }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </button>
    </form>
  );
}
