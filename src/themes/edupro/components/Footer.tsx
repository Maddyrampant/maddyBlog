"use client";

import Link from "next/link";

type FooterProps = {
  authorName?: string;
};

export default function EduProFooter({ authorName }: FooterProps) {
  return (
    <footer style={{ borderTop: "1px solid var(--edupro-border)" }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          <div>
            <Link href="/" className="text-lg font-bold edupro-gradient-text">
              EduPro
            </Link>
            <p
              className="text-sm mt-2"
              style={{ color: "var(--edupro-text-muted)" }}
            >
              Your learning journey starts here. Explore tutorials, courses, and
              educational content designed to help you grow.
            </p>
          </div>
          <div>
            <h4
              className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: "var(--edupro-text-muted)" }}
            >
              Learn
            </h4>
            <div className="flex flex-col gap-2 text-sm">
              <Link
                href="/"
                style={{ color: "var(--edupro-text-muted)" }}
                className="hover"
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--edupro-accent)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--edupro-text-muted)")
                }
              >
                All Courses
              </Link>
              <Link
                href="/categories"
                style={{ color: "var(--edupro-text-muted)" }}
                className="hover"
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--edupro-accent)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--edupro-text-muted)")
                }
              >
                Subjects
              </Link>
              <Link
                href="/tags"
                style={{ color: "var(--edupro-text-muted)" }}
                className="hover"
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--edupro-accent)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--edupro-text-muted)")
                }
              >
                Skills
              </Link>
            </div>
          </div>
          <div>
            <h4
              className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: "var(--edupro-text-muted)" }}
            >
              Resources
            </h4>
            <div className="flex flex-col gap-2 text-sm">
              <Link
                href="/admin"
                style={{ color: "var(--edupro-text-muted)" }}
                className="hover"
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--edupro-accent)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--edupro-text-muted)")
                }
              >
                Admin
              </Link>
              <span style={{ color: "var(--edupro-text-muted)" }}>
                &copy; {new Date().getFullYear()}
                {authorName ? ` ${authorName}.` : " maddyBlog."}
              </span>
            </div>
          </div>
        </div>
        <hr className="edupro-divider" />
      </div>
    </footer>
  );
}
