"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { BuilderElement } from "@/lib/header-footer/types";

const LANGUAGES = [
  { code: "fa", label: "فارسی", dir: "rtl" },
  { code: "en", label: "English", dir: "ltr" },
];

export default function LanguageSwitcherElement({
  element: _el,
  themeName,
}: {
  element: BuilderElement;
  themeName: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const currentLocale = pathname?.startsWith("/en") ? "en" : "fa";
  const current =
    LANGUAGES.find((l) => l.code === currentLocale) || LANGUAGES[0];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function switchLang(code: string) {
    if (code === currentLocale) return;
    const newPath =
      code === "fa" ? pathname?.replace(/^\/en/, "") || "/" : `/en${pathname}`;
    router.push(newPath);
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2 py-1 text-sm rounded-md transition-colors hover:opacity-80"
        style={{ color: `var(--${themeName}-text)` }}
        aria-label="Switch language"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        <span className="uppercase font-medium text-xs">{current.code}</span>
      </button>

      {open && (
        <div
          className="absolute top-full mt-1 right-0 min-w-[120px] rounded-md shadow-lg border py-1 z-50"
          style={{
            backgroundColor: `var(--${themeName}-card-bg, #ffffff)`,
            borderColor: `var(--${themeName}-border, #e4e4e7)`,
          }}
        >
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => switchLang(lang.code)}
              className={`w-full text-left px-3 py-1.5 text-sm transition-colors ${
                lang.code === currentLocale
                  ? "font-semibold"
                  : "hover:opacity-80"
              }`}
              style={{
                color: `var(--${themeName}-text)`,
                backgroundColor:
                  lang.code === currentLocale
                    ? `var(--${themeName}-accent-light, transparent)`
                    : "transparent",
              }}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
