"use client";

import { useState, useEffect } from "react";
import { Save, Globe, FileText, Mail } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import { useTranslation, useI18n } from "@/i18n/provider";
import PluginInjector from "@/components/plugin/PluginInjector";
import { locales, localeNames, type Locale } from "@/i18n/config";

export default function SettingsPage() {
  const t = useTranslation();
  const { locale, setLocale } = useI18n();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    siteName: "maddyBlog",
    siteDescription: "A modern blogging platform",
    language: locale,
  });

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load settings");
        return res.json();
      })
      .then((data) => {
        setForm({
          siteName: data.siteName || "maddyBlog",
          siteDescription: data.siteDescription || "A modern blogging platform",
          language: (data.language as Locale) || locale,
        });
      })
      .catch(() => setError(t("settings.loadError")))
      .finally(() => setLoading(false));
  }, [locale, t]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaved(false);

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to save settings");
      setLocale(form.language as typeof locale);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError(t("settings.saveError"));
    }
  }

  if (loading) {
    return (
      <div>
        <PageHeader
          title={t("settings.title")}
          subtitle={t("settings.subtitle")}
        />
        <div className="admin-card p-12 text-center">
          <div className="animate-spin w-6 h-6 border-2 border-theme-primary border-t-transparent rounded-full mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={t("settings.title")}
        subtitle={t("settings.subtitle")}
      />

      <form onSubmit={handleSave} className="max-w-2xl space-y-6">
        {error && (
          <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        <div className="admin-card p-6">
          <h3 className="text-sm font-semibold flex items-center gap-2 mb-5">
            <Globe size={16} className="text-theme-primary" />
            {t("settings.general")}
          </h3>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1.5">
                <FileText size={14} className="inline mr-1.5 text-zinc-400" />
                {t("settings.siteName")}
              </label>
              <input
                type="text"
                value={form.siteName}
                onChange={(e) => setForm({ ...form, siteName: e.target.value })}
                className="admin-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">
                <Mail size={14} className="inline mr-1.5 text-zinc-400" />
                {t("settings.siteDescription")}
              </label>
              <textarea
                value={form.siteDescription}
                onChange={(e) =>
                  setForm({ ...form, siteDescription: e.target.value })
                }
                className="admin-input h-24 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">
                <Globe size={14} className="inline mr-1.5 text-zinc-400" />
                {t("settings.language")}
              </label>
              <select
                value={form.language}
                onChange={(e) =>
                  setForm({ ...form, language: e.target.value as Locale })
                }
                className="admin-input w-48"
              >
                {locales.map((l) => (
                  <option key={l} value={l}>
                    {localeNames[l]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" className="admin-btn admin-btn-primary">
            <Save size={16} />
            {t("settings.save")}
          </button>
          {saved && (
            <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium animate-pulse">
              {t("settings.saved")}
            </span>
          )}
        </div>
      </form>

      <PluginInjector extensionPoint="admin:settings:tab" />
    </div>
  );
}
