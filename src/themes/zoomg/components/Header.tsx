"use client";

import Link from "next/link";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

export default function ZoomgHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        setSearchOpen(false);
        setSearchQuery("");
      }
    },
    [searchQuery, router],
  );

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: "var(--zoomg-bg-secondary)",
        borderBottom: "1px solid var(--zoomg-border)",
        boxShadow: "var(--zoomg-shadow-sm)",
      }}
    >
      <div
        className="mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8"
        style={{
          height: "var(--zoomg-header-height)",
          maxWidth: "var(--zoomg-container-width)",
        }}
      >
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-xl font-black tracking-tight zoomg-gradient-text"
            style={{ fontSize: "1.35rem" }}
          >
            زومجی
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link
              href="/"
              className="font-medium transition-colors"
              style={{ color: "var(--zoomg-text-primary)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--zoomg-accent)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--zoomg-text-primary)")}
            >
              خانه
            </Link>
            <Link
              href="/admin"
              className="transition-colors"
              style={{ color: "var(--zoomg-text-muted)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--zoomg-accent)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--zoomg-text-muted)")}
            >
              پنل مدیریت
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {searchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجو..."
                className="zoomg-input w-40 sm:w-56 text-sm"
                style={{ fontSize: "0.8rem" }}
                autoFocus
                onBlur={() => {
                  if (!searchQuery) setSearchOpen(false);
                }}
              />
              <button
                type="submit"
                className="zoomg-btn zoomg-btn-primary text-xs px-3 py-1.5"
                style={{ fontSize: "0.75rem" }}
              >
                برو
              </button>
            </form>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="zoomg-btn zoomg-btn-outline text-xs px-3 py-1.5"
              style={{ fontSize: "0.75rem" }}
              aria-label="باز کردن جستجو"
            >
              جستجو
            </button>
          )}

          <button
            className="md:hidden flex flex-col gap-1 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="منو"
          >
            <span
              className="block w-5 h-0.5 transition-transform"
              style={{
                background: "var(--zoomg-text-primary)",
                transform: menuOpen ? "rotate(45deg) translateY(2.5px)" : "none",
              }}
            />
            <span
              className="block w-5 h-0.5 transition-opacity"
              style={{
                background: "var(--zoomg-text-primary)",
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              className="block w-5 h-0.5 transition-transform"
              style={{
                background: "var(--zoomg-text-primary)",
                transform: menuOpen ? "rotate(-45deg) translateY(-2.5px)" : "none",
              }}
            />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          className="md:hidden px-4 pb-5 space-y-3"
          style={{ background: "var(--zoomg-bg-secondary)" }}
        >
          <Link
            href="/"
            className="block text-sm font-medium"
            style={{ color: "var(--zoomg-accent)" }}
            onClick={() => setMenuOpen(false)}
          >
            خانه
          </Link>
          <Link
            href="/admin"
            className="block text-sm"
            style={{ color: "var(--zoomg-text-muted)" }}
            onClick={() => setMenuOpen(false)}
          >
            پنل مدیریت
          </Link>
        </div>
      )}
    </header>
  );
}
