"use client";

import Link from "next/link";
import { useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type HeaderProps = {};

export default function NewsWireHeader({}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: "var(--newswire-bg)",
        borderBottom: "1px solid var(--newswire-border)",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <Link
            href="/"
            className="text-xl font-black tracking-tight newswire-gradient-text"
          >
            NewsWire
          </Link>

          <nav className="hidden sm:flex items-center gap-6 text-sm font-medium">
            <Link
              href="/"
              className="transition-colors"
              style={{ color: "var(--newswire-text)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--newswire-accent)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--newswire-text)")
              }
            >
              Home
            </Link>
            <Link
              href="/admin"
              className="transition-colors"
              style={{ color: "var(--newswire-text)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--newswire-accent)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--newswire-text)")
              }
            >
              Admin
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <button
              className="sm:hidden flex flex-col gap-1 p-2"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span
                className="block w-5 h-px transition-transform"
                style={{
                  background: "var(--newswire-text)",
                  transform: menuOpen
                    ? "rotate(45deg) translateY(2.5px)"
                    : "none",
                }}
              />
              <span
                className="block w-5 h-px transition-opacity"
                style={{
                  background: "var(--newswire-text)",
                  opacity: menuOpen ? 0 : 1,
                }}
              />
              <span
                className="block w-5 h-px transition-transform"
                style={{
                  background: "var(--newswire-text)",
                  transform: menuOpen
                    ? "rotate(-45deg) translateY(-2.5px)"
                    : "none",
                }}
              />
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="sm:hidden px-4 pb-4 space-y-3">
          <Link
            href="/"
            className="block text-sm font-bold"
            style={{ color: "var(--newswire-accent)" }}
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/admin"
            className="block text-sm"
            style={{ color: "var(--newswire-text)" }}
            onClick={() => setMenuOpen(false)}
          >
            Admin
          </Link>
        </div>
      )}
    </header>
  );
}
