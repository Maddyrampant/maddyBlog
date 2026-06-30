"use client";

import Link from "next/link";

type FooterProps = {
  authorName?: string;
};

export default function MadelinFooter({ authorName }: FooterProps) {
  return (
    <footer style={{ borderTop: "1px solid var(--madelin-border)" }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div
            className="text-sm"
            style={{ color: "var(--madelin-text-muted)" }}
          >
            <span className="madelin-gradient-text font-semibold">Madelin</span>
            <span className="mx-2">&middot;</span>
            <span>
              &copy; {new Date().getFullYear()}
              {authorName ? ` ${authorName}.` : " maddyBlog."}
            </span>
          </div>
          <nav
            className="flex items-center gap-6 text-sm"
            style={{ color: "var(--madelin-text-muted)" }}
          >
            <Link
              href="/"
              className="transition-colors"
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--madelin-accent)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--madelin-text-muted)")
              }
            >
              Home
            </Link>
            <Link
              href="/admin"
              className="transition-colors"
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--madelin-accent)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--madelin-text-muted)")
              }
            >
              Admin
            </Link>
          </nav>
        </div>
        <hr className="madelin-divider mt-8 mb-0" />
      </div>
    </footer>
  );
}
