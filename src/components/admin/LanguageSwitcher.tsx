"use client";

import { useState } from "react";
import { Languages, ChevronDown } from "lucide-react";
import { useI18n } from "@/i18n/provider";
import { locales, localeNames } from "@/i18n/config";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-sm"
      >
        <Languages size={16} className="text-zinc-500" />
        <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">{locale.toUpperCase()}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-36 bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 py-1 z-20">
            {locales.map((l) => (
              <button
                key={l}
                onClick={() => { setLocale(l); setOpen(false); }}
                className={`flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors ${
                  locale === l ? "text-theme-primary font-medium" : "text-zinc-600 dark:text-zinc-400"
                }`}
              >
                <span>{localeNames[l]}</span>
                {locale === l && <span className="ml-auto text-theme-primary">✓</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
