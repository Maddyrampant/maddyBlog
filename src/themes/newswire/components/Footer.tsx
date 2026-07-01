"use client";

import Link from "next/link";

type FooterProps = {
  authorName?: string;
};

export default function NewsWireFooter({ authorName }: FooterProps) {
  return (
    <footer style={{ borderTop: "2px solid var(--newswire-accent)" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <h4 className="text-lg font-black newswire-gradient-text mb-4">
              NewsWire
            </h4>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--newswire-text-muted)" }}
            >
              Stay informed. Stay ahead.
            </p>
          </div>
          <div>
            <h5
              className="text-xs font-bold uppercase tracking-[0.15em] mb-4"
              style={{ color: "var(--newswire-accent)" }}
            >
              Sections
            </h5>
            <div className="space-y-2 text-sm">
              <Link
                href="/"
                className="block transition-colors"
                style={{ color: "var(--newswire-text-muted)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--newswire-accent)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--newswire-text-muted)")
                }
              >
                Home
              </Link>
              <Link
                href="/admin"
                className="block transition-colors"
                style={{ color: "var(--newswire-text-muted)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--newswire-accent)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--newswire-text-muted)")
                }
              >
                Admin
              </Link>
            </div>
          </div>
          <div>
            <h5
              className="text-xs font-bold uppercase tracking-[0.15em] mb-4"
              style={{ color: "var(--newswire-accent)" }}
            >
              More
            </h5>
            <div className="space-y-2 text-sm">
              <Link
                href="/"
                className="block transition-colors"
                style={{ color: "var(--newswire-text-muted)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--newswire-accent)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--newswire-text-muted)")
                }
              >
                Latest
              </Link>
            </div>
          </div>
          <div>
            <h5
              className="text-xs font-bold uppercase tracking-[0.15em] mb-4"
              style={{ color: "var(--newswire-accent)" }}
            >
              Legal
            </h5>
            <div className="space-y-2 text-sm">
              <span style={{ color: "var(--newswire-text-muted)" }}>
                &copy; {new Date().getFullYear()}
                {authorName ? ` ${authorName}.` : " maddyBlog."}
              </span>
            </div>
          </div>
        </div>
        <hr className="newswire-divider" />
      </div>
    </footer>
  );
}
