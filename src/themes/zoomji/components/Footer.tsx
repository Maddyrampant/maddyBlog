"use client";

import Link from "next/link";

type FooterProps = {
  authorName?: string;
};

export default function ZoomjiFooter({ authorName }: FooterProps) {
  return (
    <footer style={{ borderTop: "1px solid var(--zoomji-border)" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div
            className="text-sm"
            style={{ color: "var(--zoomji-text-muted)" }}
          >
            <span className="zoomji-gradient-text font-black">Zoomji</span>
            <span className="mx-2">&middot;</span>
            <span>
              &copy; {new Date().getFullYear()}
              {authorName ? ` ${authorName}.` : " maddyBlog."}
            </span>
          </div>
          <nav
            className="flex items-center gap-6 text-sm"
            style={{ color: "var(--zoomji-text-muted)" }}
          >
            <Link
              href="/"
              className="transition-colors"
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--zoomji-accent)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--zoomji-text-muted)")
              }
            >
              Home
            </Link>
            <Link
              href="/admin"
              className="transition-colors"
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--zoomji-accent)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--zoomji-text-muted)")
              }
            >
              Admin
            </Link>
          </nav>
        </div>
        <hr className="zoomji-divider mt-8 mb-0" />
      </div>
    </footer>
  );
}
