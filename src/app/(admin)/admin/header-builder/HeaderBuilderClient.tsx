"use client";

import { useState, useEffect, useCallback } from "react";
import PageHeader from "@/components/admin/PageHeader";
import { BuilderPanel } from "@/components/admin/header-builder/BuilderPanel";
import { HeaderFooterPreview } from "@/components/admin/header-builder/HeaderFooterPreview";
import type { HeaderConfig, FooterConfig } from "@/lib/header-footer/types";
import { Save, RotateCcw, Monitor } from "lucide-react";

const THEMES = [
  { id: "default", label: "Default" },
  { id: "madelin", label: "Madelin" },
  { id: "zoomg", label: "Zoomg" },
  { id: "zoomji", label: "Zoomji" },
  { id: "digitech", label: "DigiTech" },
  { id: "gameverse", label: "GameVerse" },
  { id: "personalblog", label: "PersonalBlog" },
  { id: "newswire", label: "NewsWire" },
  { id: "edupro", label: "EduPro" },
];

export default function HeaderBuilderClient() {
  const [theme, setTheme] = useState("default");
  const [tab, setTab] = useState<"header" | "footer">("header");
  const [header, setHeader] = useState<HeaderConfig | null>(null);
  const [footer, setFooter] = useState<FooterConfig | null>(null);
  const [, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const showToast = useCallback(
    (msg: string, type: "success" | "error" = "success") => {
      setToast(msg);
      setToastType(type);
      setTimeout(() => setToast(null), 3000);
    },
    [],
  );

  const loadConfig = useCallback(
    async (t: string) => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/admin/header-footer?theme=${encodeURIComponent(t)}`,
        );
        if (!res.ok) throw new Error("Failed to load");
        const data = await res.json();
        setHeader(data.header);
        setFooter(data.footer);
      } catch {
        showToast("Failed to load configuration", "error");
      } finally {
        setLoading(false);
      }
    },
    [showToast],
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadConfig(theme);
  }, [theme, loadConfig]);

  async function handleSave() {
    if (!header || !footer) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/header-footer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme, header, footer }),
      });
      if (res.ok) {
        showToast("Configuration saved successfully");
      } else {
        showToast("Failed to save configuration", "error");
      }
    } catch {
      showToast("Failed to save configuration", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleReset() {
    if (!confirm("Reset to default configuration? This cannot be undone."))
      return;
    try {
      const res = await fetch(
        `/api/admin/header-footer?theme=${encodeURIComponent(theme)}`,
        {
          method: "PUT",
        },
      );
      if (!res.ok) throw new Error("Failed to reset");
      const data = await res.json();
      setHeader(data.header);
      setFooter(data.footer);
      showToast("Reset to defaults");
    } catch {
      showToast("Failed to reset configuration", "error");
    }
  }

  function handleChange(newHeader: HeaderConfig, newFooter: FooterConfig) {
    setHeader(newHeader);
    setFooter(newFooter);
  }

  if (!header || !footer) {
    return (
      <div>
        <PageHeader
          title="Header & Footer Builder"
          subtitle="Customize your theme header and footer"
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
        title="Header & Footer Builder"
        subtitle="Drag-and-drop builder for theme header and footer"
        actions={
          <div className="flex items-center gap-2">
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="admin-input text-sm w-auto py-1.5"
            >
              {THEMES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
            <button
              onClick={handleReset}
              className="admin-btn admin-btn-outline text-sm"
            >
              <RotateCcw size={14} />
              Reset
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="admin-btn admin-btn-primary text-sm"
            >
              <Save size={14} />
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        }
      />

      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-2.5 rounded-lg shadow-lg text-sm font-medium transition-all ${
            toastType === "success"
              ? "bg-emerald-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {toast}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-[440px] xl:w-[520px] flex-shrink-0 order-2 lg:order-1">
          <div className="flex gap-1 mb-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
            <button
              onClick={() => setTab("header")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                tab === "header"
                  ? "bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              }`}
            >
              Header
            </button>
            <button
              onClick={() => setTab("footer")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                tab === "footer"
                  ? "bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              }`}
            >
              Footer
            </button>
          </div>

          <BuilderPanel
            header={header}
            footer={footer}
            section={tab}
            onChange={handleChange}
          />
        </div>

        <div className="flex-1 min-w-0 order-1 lg:order-2">
          <div className="admin-card p-4 lg:sticky lg:top-4">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <Monitor size={16} className="text-zinc-400" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Live Preview
              </h3>
            </div>
            <div className="min-h-[300px]">
              <HeaderFooterPreview
                header={header}
                footer={footer}
                themeName={theme}
                section={tab}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
