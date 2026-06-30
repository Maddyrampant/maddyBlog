export const locales = ["en", "fa", "de", "fr"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  fa: "فارسی",
  de: "Deutsch",
  fr: "Français",
};

export const localeFlags: Record<Locale, string> = {
  en: "🇬🇧",
  fa: "🇮🇷",
  de: "🇩🇪",
  fr: "🇫🇷",
};

export const isRTL: Record<Locale, boolean> = {
  en: false,
  fa: true,
  de: false,
  fr: false,
};
