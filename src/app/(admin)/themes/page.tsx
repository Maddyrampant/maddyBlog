"use client";

import { useState, useEffect, useCallback } from "react";

type ThemeInfo = {
  name: string;
  version: string;
  author: string;
  description: string;
  previewImage: string | null;
  status: string;
  error: string | null;
  config: Record<string, string | number | boolean>;
  schema: {
    fields: ConfigField[];
    groups?: { label: string; key: string; fields: string[] }[];
  };
  supportedFeatures: string[];
  active: boolean;
  installedAt: string;
};

type ConfigField = {
  key: string;
  label: string;
  type: string;
  defaultValue: string | number | boolean;
  options?: { label: string; value: string }[];
  description?: string;
};

export default function ThemesPage() {
  const [themes, setThemes] = useState<ThemeInfo[]>([]);
  const [activeTheme, setActiveTheme] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedTheme, setExpandedTheme] = useState<string | null>(null);

  const fetchThemes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/themes");
      if (!res.ok) throw new Error("Failed to load themes");
      const data = await res.json();
      setThemes(data.themes);
      setActiveTheme(data.activeTheme);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load themes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/themes");
        if (!res.ok) throw new Error("Failed to load themes");
        const data = await res.json();
        if (!cancelled) {
          setThemes(data.themes);
          setActiveTheme(data.activeTheme);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load themes",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleActivate = async (name: string) => {
    const res = await fetch("/api/themes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, action: "activate" }),
    });
    if (res.ok) {
      setActiveTheme(name);
      await fetchThemes();
    }
  };

  const handleConfigure = async (
    name: string,
    config: Record<string, string | number | boolean>,
  ) => {
    const res = await fetch("/api/themes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, action: "configure", config }),
    });
    if (res.ok) {
      await fetchThemes();
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-8 w-48 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
        <div className="h-32 bg-zinc-100 dark:bg-zinc-900 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Appearance</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Manage your blog&apos;s themes and appearance settings.
        </p>
      </div>

      <div className="space-y-4">
        {themes.map((theme) => (
          <ThemeCard
            key={theme.name}
            theme={theme}
            isActive={theme.name === activeTheme}
            onActivate={handleActivate}
            onConfigure={handleConfigure}
            expanded={expandedTheme === theme.name}
            onToggleExpand={() =>
              setExpandedTheme(expandedTheme === theme.name ? null : theme.name)
            }
          />
        ))}
      </div>

      {themes.length === 0 && (
        <div className="text-center py-16 text-zinc-500">
          <p className="text-lg font-medium mb-1">No themes installed</p>
          <p className="text-sm">
            Install a theme to customize your blog&apos;s appearance.
          </p>
        </div>
      )}
    </div>
  );
}

function ThemeCard({
  theme,
  isActive,
  onActivate,
  onConfigure,
  expanded,
  onToggleExpand,
}: {
  theme: ThemeInfo;
  isActive: boolean;
  onActivate: (name: string) => void;
  onConfigure: (
    name: string,
    config: Record<string, string | number | boolean>,
  ) => void;
  expanded: boolean;
  onToggleExpand: () => void;
}) {
  const [configValues, setConfigValues] = useState<
    Record<string, string | number | boolean>
  >(theme.config);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onConfigure(theme.name, configValues);
    setSaving(false);
  };

  const statusColors: Record<string, string> = {
    active:
      "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
    inactive:
      "text-zinc-500 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800",
    error:
      "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
  };

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              <h3 className="font-semibold text-lg">{theme.name}</h3>
              <span
                className={`text-xs px-2 py-0.5 rounded-full border ${statusColors[theme.status] ?? statusColors.inactive}`}
              >
                {theme.status}
              </span>
              {isActive && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                  Active
                </span>
              )}
            </div>
            <p className="text-sm text-zinc-500 mt-1">{theme.description}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-zinc-400">
              <span>v{theme.version}</span>
              <span>by {theme.author}</span>
              {theme.supportedFeatures.length > 0 && (
                <span>{theme.supportedFeatures.length} features</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 ml-4 shrink-0">
            {!isActive && theme.status !== "error" && (
              <button
                type="button"
                onClick={() => onActivate(theme.name)}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
              >
                Activate
              </button>
            )}
            {isActive && (
              <button
                type="button"
                onClick={onToggleExpand}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Configure
              </button>
            )}
          </div>
        </div>
      </div>

      {expanded && isActive && (
        <div className="border-t border-zinc-200 dark:border-zinc-800 p-5 space-y-5">
          {theme.schema.groups && theme.schema.groups.length > 0 ? (
            theme.schema.groups.map((group) => {
              const groupFields = theme.schema.fields.filter((f) =>
                group.fields.includes(f.key),
              );
              if (groupFields.length === 0) return null;
              return (
                <div key={group.key}>
                  <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
                    {group.label}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {groupFields.map((field) => (
                      <ConfigFieldInput
                        key={field.key}
                        field={field}
                        value={configValues[field.key] ?? field.defaultValue}
                        onChange={(val) =>
                          setConfigValues((prev) => ({
                            ...prev,
                            [field.key]: val,
                          }))
                        }
                      />
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {theme.schema.fields.map((field) => (
                <ConfigFieldInput
                  key={field.key}
                  field={field}
                  value={configValues[field.key] ?? field.defaultValue}
                  onChange={(val) =>
                    setConfigValues((prev) => ({ ...prev, [field.key]: val }))
                  }
                />
              ))}
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 text-sm font-medium rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 transition-colors"
            >
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ConfigFieldInput({
  field,
  value,
  onChange,
}: {
  field: ConfigField;
  value: string | number | boolean;
  onChange: (val: string | number | boolean) => void;
}) {
  if (field.type === "color") {
    return (
      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1.5">
          {field.label}
        </label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
            className="w-10 h-10 rounded-lg border border-zinc-300 dark:border-zinc-700 cursor-pointer"
          />
          <input
            type="text"
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 px-3 py-1.5 text-sm border border-zinc-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-500"
          />
        </div>
        {field.description && (
          <p className="text-xs text-zinc-400 mt-1">{field.description}</p>
        )}
      </div>
    );
  }

  if (field.type === "select" && field.options) {
    return (
      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1.5">
          {field.label}
        </label>
        <select
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-1.5 text-sm border border-zinc-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-500"
        >
          {field.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (field.type === "boolean") {
    return (
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id={`field-${field.key}`}
          checked={value as boolean}
          onChange={(e) => onChange(e.target.checked)}
          className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-700"
        />
        <label
          htmlFor={`field-${field.key}`}
          className="text-sm text-zinc-700 dark:text-zinc-300"
        >
          {field.label}
        </label>
      </div>
    );
  }

  if (field.type === "number") {
    return (
      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1.5">
          {field.label}
        </label>
        <input
          type="number"
          value={value as number}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full px-3 py-1.5 text-sm border border-zinc-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-500"
        />
        {field.description && (
          <p className="text-xs text-zinc-400 mt-1">{field.description}</p>
        )}
      </div>
    );
  }

  return (
    <div>
      <label className="block text-xs font-medium text-zinc-500 mb-1.5">
        {field.label}
      </label>
      <input
        type="text"
        value={value as string}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-1.5 text-sm border border-zinc-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-500"
      />
      {field.description && (
        <p className="text-xs text-zinc-400 mt-1">{field.description}</p>
      )}
    </div>
  );
}
