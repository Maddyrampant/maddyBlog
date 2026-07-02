"use client";

import { useEffect, useState, useCallback } from "react";
import { Check, X, Settings, Trash2, Palette } from "lucide-react";

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
    fields: Array<{
      key: string;
      label: string;
      type: string;
      defaultValue: string | number | boolean;
      options?: { label: string; value: string }[];
      description?: string;
    }>;
    groups?: Array<{ label: string; key: string; fields: string[] }>;
  };
  supportedFeatures: string[];
  active: boolean;
  installedAt: string;
};

export default function ThemeManagerClient() {
  const [themes, setThemes] = useState<ThemeInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [configuring, setConfiguring] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch("/api/themes");
        if (!res.ok) throw new Error("Failed to fetch themes");
        const data = await res.json();
        if (mounted) setThemes(data.themes);
      } catch (err) {
        if (mounted)
          setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const fetchThemes = useCallback(async () => {
    try {
      const res = await fetch("/api/themes");
      if (!res.ok) throw new Error("Failed to fetch themes");
      const data = await res.json();
      setThemes(data.themes);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }, []);

  async function handleAction(name: string, action: string) {
    try {
      const res = await fetch("/api/themes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, action }),
      });
      if (!res.ok) throw new Error("Action failed");
      await fetchThemes();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed");
    }
  }

  async function handleConfigure(
    name: string,
    config: Record<string, string | number | boolean>,
  ) {
    try {
      const res = await fetch("/api/themes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, action: "configure", config }),
      });
      if (!res.ok) throw new Error("Failed to save config");
      setConfiguring(null);
      await fetchThemes();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save config");
    }
  }

  if (loading) {
    return (
      <div className="admin-card p-12 text-center">
        <div className="animate-spin w-6 h-6 border-2 border-theme-primary border-t-transparent rounded-full mx-auto" />
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="underline text-xs">
            Dismiss
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {themes.map((theme) => (
          <div
            key={theme.name}
            className={`admin-card overflow-hidden ${
              theme.active ? "ring-2 ring-theme-primary" : ""
            }`}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${
                      theme.active
                        ? "gradient-primary"
                        : "bg-zinc-100 dark:bg-zinc-800"
                    }`}
                  >
                    <Palette
                      size={22}
                      className={theme.active ? "text-white" : "text-zinc-400"}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold">{theme.name}</h3>
                      {theme.active && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                          <Check size={10} />
                          Active
                        </span>
                      )}
                      {theme.status === "error" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                          <X size={10} />
                          Error
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      v{theme.version} by {theme.author}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed">
                {theme.description}
              </p>

              {theme.error && (
                <p className="text-xs text-red-500 mb-4 bg-red-50 dark:bg-red-950/50 p-3 rounded-lg">
                  {theme.error}
                </p>
              )}

              {theme.supportedFeatures.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {theme.supportedFeatures.map((feature) => (
                    <span
                      key={feature}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 font-medium"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                {!theme.active && theme.status !== "error" && (
                  <button
                    onClick={() => handleAction(theme.name, "activate")}
                    className="admin-btn admin-btn-primary admin-btn-sm"
                  >
                    <Check size={14} />
                    Activate
                  </button>
                )}
                {theme.active && (
                  <button
                    onClick={() => handleAction(theme.name, "deactivate")}
                    className="admin-btn admin-btn-outline admin-btn-sm"
                  >
                    Deactivate
                  </button>
                )}
                <button
                  onClick={() => setConfiguring(theme.name)}
                  className="admin-btn admin-btn-outline admin-btn-sm"
                >
                  <Settings size={14} />
                  Configure
                </button>
                {theme.name !== "default" && (
                  <button
                    onClick={() => {
                      if (confirm(`Uninstall theme "${theme.name}"?`)) {
                        handleAction(theme.name, "uninstall");
                      }
                    }}
                    className="admin-btn admin-btn-sm admin-btn-danger ml-auto"
                  >
                    <Trash2 size={14} />
                    Uninstall
                  </button>
                )}
              </div>
            </div>

            {configuring === theme.name && (
              <ThemeConfigPanel
                theme={theme}
                onSave={(config) => handleConfigure(theme.name, config)}
                onClose={() => setConfiguring(null)}
              />
            )}
          </div>
        ))}
      </div>

      {themes.length === 0 && (
        <div className="admin-card p-12 text-center">
          <Palette
            size={40}
            className="mx-auto text-zinc-200 dark:text-zinc-700 mb-4"
          />
          <p className="text-zinc-500 font-medium">No themes installed</p>
          <p className="text-sm text-zinc-400 mt-1">
            Install a theme to customize your blog appearance.
          </p>
        </div>
      )}
    </div>
  );
}

function ThemeConfigPanel({
  theme,
  onSave,
  onClose,
}: {
  theme: ThemeInfo;
  onSave: (config: Record<string, string | number | boolean>) => void;
  onClose: () => void;
}) {
  const [config, setConfig] = useState<
    Record<string, string | number | boolean>
  >({
    ...theme.config,
  });

  function setValue(key: string, value: string | number | boolean) {
    setConfig((prev) => ({ ...prev, [key]: value }));
  }

  const { groups, fields } = theme.schema;

  const groupedFields = groups
    ? groups.map((group) => ({
        ...group,
        fields: group.fields
          .map((key) => fields.find((f) => f.key === key))
          .filter(Boolean) as typeof fields,
      }))
    : [];

  const ungroupedFields = groups
    ? fields.filter((f) => !groups.some((g) => g.fields.includes(f.key)))
    : fields;

  return (
    <div className="border-t border-zinc-100 dark:border-zinc-800 p-6 bg-zinc-50/50 dark:bg-zinc-900/30">
      <h4 className="font-semibold text-sm mb-4 flex items-center gap-2">
        <Settings size={14} className="text-theme-primary" />
        Configuration
      </h4>

      <div className="space-y-6">
        {groupedFields.map((group) => (
          <div key={group.key}>
            <h5 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3">
              {group.label}
            </h5>
            <div className="space-y-4">
              {group.fields.map((field) => (
                <ConfigField
                  key={field.key}
                  field={field}
                  value={config[field.key] ?? field.defaultValue}
                  onChange={(v) => setValue(field.key, v)}
                />
              ))}
            </div>
          </div>
        ))}
        {ungroupedFields.length > 0 && (
          <div className="space-y-4">
            {ungroupedFields.map((field) => (
              <ConfigField
                key={field.key}
                field={field}
                value={config[field.key] ?? field.defaultValue}
                onChange={(v) => setValue(field.key, v)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800">
        <button
          onClick={() => onSave(config)}
          className="admin-btn admin-btn-primary admin-btn-sm"
        >
          <Check size={14} />
          Save Configuration
        </button>
        <button
          onClick={onClose}
          className="admin-btn admin-btn-outline admin-btn-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function ConfigField({
  field,
  value,
  onChange,
}: {
  field: ThemeInfo["schema"]["fields"][0];
  value: string | number | boolean;
  onChange: (value: string | number | boolean) => void;
}) {
  switch (field.type) {
    case "color":
      return (
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">{field.label}</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={value as string}
              onChange={(e) => onChange(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer border border-zinc-300 dark:border-zinc-700"
            />
            <input
              type="text"
              value={value as string}
              onChange={(e) => onChange(e.target.value)}
              className="w-20 px-2 py-1 text-xs border border-zinc-300 dark:border-zinc-700 rounded bg-transparent"
            />
          </div>
        </div>
      );
    case "select":
      return (
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">{field.label}</label>
          <select
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
            className="admin-input w-40 text-sm"
          >
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      );
    case "boolean":
      return (
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">{field.label}</label>
          <button
            onClick={() => onChange(!value)}
            className={`relative w-10 h-5 rounded-full transition-colors ${
              value ? "bg-theme-primary" : "bg-zinc-300 dark:bg-zinc-700"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                value ? "translate-x-5" : ""
              }`}
            />
          </button>
        </div>
      );
    case "number":
      return (
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium">{field.label}</label>
            {field.description && (
              <p className="text-xs text-zinc-400">{field.description}</p>
            )}
          </div>
          <input
            type="number"
            value={value as number}
            onChange={(e) => onChange(Number(e.target.value))}
            className="admin-input w-20 text-sm text-right"
          />
        </div>
      );
    default:
      return (
        <div>
          <label className="text-sm font-medium block mb-1">
            {field.label}
          </label>
          {field.description && (
            <p className="text-xs text-zinc-400 mb-1">{field.description}</p>
          )}
          <input
            type="text"
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
            className="admin-input text-sm"
          />
        </div>
      );
  }
}
