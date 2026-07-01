"use client";

import Link from "next/link";

type FooterProps = {
  authorName?: string;
};

export default function PersonalBlogFooter({ authorName }: FooterProps) {
  return (
    <footer style={{ borderTop: "1px solid var(--personalblog-border)" }}>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div
            className="text-sm"
            style={{ color: "var(--personalblog-text-muted)" }}
          >
            <span className="personalblog-gradient-text font-semibold">
              PersonalBlog
            </span>
            <span className="mx-2">&middot;</span>
            <span>
              &copy; {new Date().getFullYear()}
              {authorName ? ` ${authorName}.` : " maddyBlog."}
            </span>
          </div>
          <nav
            className="flex items-center gap-6 text-sm"
            style={{ color: "var(--personalblog-text-muted)" }}
          >
            <Link
              href="/"
              className="transition-colors"
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--personalblog-accent)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--personalblog-text-muted)")
              }
            >
              Home
            </Link>
            <Link
              href="/admin"
              className="transition-colors"
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--personalblog-accent)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--personalblog-text-muted)")
              }
            >
              Admin
            </Link>
          </nav>
        </div>
        <hr className="personalblog-divider mt-8 mb-0" />
      </div>
    </footer>
  );
}
