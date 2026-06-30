"use client";

import Link from "next/link";

type FooterProps = {
  authorName?: string;
};

export default function ZoomgFooter({ authorName }: FooterProps) {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--zoomg-border)",
        background: "var(--zoomg-bg-secondary)",
      }}
    >
      <div
        className="mx-auto px-4 sm:px-6 lg:px-8 py-12"
        style={{ maxWidth: "var(--zoomg-container-width)" }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div>
            <Link
              href="/"
              className="text-xl font-black zoomg-gradient-text inline-block mb-4"
            >
              زومجی
            </Link>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--zoomg-text-muted)" }}
            >
              وب سایت نقد و بررسی بازی، سینما، تلویزیون، فیلم، اخبار بازی و پوشش
              کامل کنفرانس و مراسم‌های معروف دنیای گیمینگ.
            </p>
          </div>

          <div>
            <h4
              className="font-bold text-sm mb-4"
              style={{ color: "var(--zoomg-text-primary)" }}
            >
              دسترسی سریع
            </h4>
            <nav className="flex flex-col gap-3">
              <Link
                href="/"
                className="text-sm transition-colors"
                style={{ color: "var(--zoomg-text-muted)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--zoomg-accent)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--zoomg-text-muted)")
                }
              >
                خانه
              </Link>
              <Link
                href="/admin"
                className="text-sm transition-colors"
                style={{ color: "var(--zoomg-text-muted)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--zoomg-accent)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--zoomg-text-muted)")
                }
              >
                پنل مدیریت
              </Link>
            </nav>
          </div>

          <div>
            <h4
              className="font-bold text-sm mb-4"
              style={{ color: "var(--zoomg-text-primary)" }}
            >
              دنبال کنید
            </h4>
            <div className="flex items-center gap-3">
              <span
                className="zoomg-avatar"
                style={{ width: 36, height: 36, cursor: "pointer" }}
                title="توییتر"
              >
                ت
              </span>
              <span
                className="zoomg-avatar"
                style={{ width: 36, height: 36, cursor: "pointer" }}
                title="اینستاگرام"
              >
                ا
              </span>
              <span
                className="zoomg-avatar"
                style={{ width: 36, height: 36, cursor: "pointer" }}
                title="یوتیوب"
              >
                ی
              </span>
            </div>
          </div>

          <div>
            <h4
              className="font-bold text-sm mb-4"
              style={{ color: "var(--zoomg-text-primary)" }}
            >
              اطلاعات
            </h4>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--zoomg-text-muted)" }}
            >
              تمامی حقوق مادی و معنوی این وب‌سایت محفوظ است.
              <br />
              &copy; {new Date().getFullYear()}
              {authorName ? ` ${authorName}.` : " maddyBlog."}
            </p>
          </div>
        </div>

        <hr className="zoomg-divider" />
        <p
          className="text-xs text-center mt-6"
          style={{ color: "var(--zoomg-text-muted)" }}
        >
          ساخته شده با{" "}
          <span className="zoomg-gradient-text font-bold">MaddyBlog</span>
        </p>
      </div>
    </footer>
  );
}
