"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import type { Locale } from "./config";
import { defaultLocale, isRTL } from "./config";

type Messages = Record<string, Record<string, string>>;

type I18nContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  dir: "ltr" | "rtl";
  messages: Messages;
};

const I18nContext = createContext<I18nContextType | null>(null);

async function loadMessages(locale: string): Promise<Messages> {
  try {
    const data = await import(`../../messages/${locale}.json`);
    return data.default || data;
  } catch {
    const data = await import(`../../messages/${defaultLocale}.json`);
    return data.default || data;
  }
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    try {
      return (localStorage.getItem("locale") as Locale | null) || defaultLocale;
    } catch {
      return defaultLocale;
    }
  });
  const [messages, setMessages] = useState<Messages>({});

  useEffect(() => {
    loadMessages(locale).then(setMessages);
    localStorage.setItem("locale", locale);
    document.documentElement.dir = isRTL[locale] ? "rtl" : "ltr";
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const keys = key.split(".");
      let value: unknown = messages;
      for (const k of keys) {
        if (value && typeof value === "object" && k in value) {
          value = (value as Record<string, unknown>)[k];
        } else {
          return key;
        }
      }
      if (typeof value !== "string") return key;
      if (params) {
        return value.replace(/\{(\w+)\}/g, (_, param) => String(params[param] ?? `{${param}}`));
      }
      return value;
    },
    [messages],
  );

  const dir = isRTL[locale] ? "rtl" : "ltr";

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, dir, messages }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

export function useTranslation() {
  const { t } = useI18n();
  return t;
}
