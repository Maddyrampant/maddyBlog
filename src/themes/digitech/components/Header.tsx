"use client";

import Link from "next/link";
import { useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type HeaderProps = {};

export default function DigitechHeader({}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 digitech-glass"
      style={{ borderBottom: "1px solid var(--digitech-border)" }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight digitech-gradient-text"
        >
          DigiTech
        </Link>

        <nav className="hidden sm:flex items-center gap-8 text-sm">
          <Link
            href="/"
            className="transition-colors"
            style={{ color: "var(--digitech-text-muted)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--digitech-accent)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--digitech-text-muted)")
            }
          >
            Home
          </Link>
          <Link
            href="/admin"
            className="transition-colors"
            style={{ color: "var(--digitech-text-muted)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--digitech-accent)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--digitech-text-muted)")
            }
          >
            Admin
          </Link>
        </nav>

        <button
          className="sm:hidden flex flex-col gap-1 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className="block w-5 h-px transition-transform"
            style={{
              background: "var(--digitech-text)",
              transform: menuOpen ? "rotate(45deg) translateY(2.5px)" : "none",
            }}
          />
          <span
            className="block w-5 h-px transition-opacity"
            style={{
              background: "var(--digitech-text)",
              opacity: menuOpen ? 0 : 1,
            }}
          />
          <span
            className="block w-5 h-px transition-transform"
            style={{
              background: "var(--digitech-text)",
              transform: menuOpen
                ? "rotate(-45deg) translateY(-2.5px)"
                : "none",
            }}
          />
        </button>
      </div>

      {menuOpen && (
        <div className="sm:hidden px-4 pb-4 space-y-3">
          <Link
            href="/"
            className="block text-sm font-medium"
            style={{ color: "var(--digitech-accent)" }}
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/admin"
            className="block text-sm"
            style={{ color: "var(--digitech-text-muted)" }}
            onClick={() => setMenuOpen(false)}
          >
            Admin
          </Link>
        </div>
      )}
    </header>
  );
}
