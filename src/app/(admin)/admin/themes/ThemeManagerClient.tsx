"use client";

import { useEffect, useState, useCallback } from "react";

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
        if (mounted) {
          setThemes(data.themes);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Unknown error");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
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
      <div className="flex items-center justify-center py-20">
        <p className="text-zinc-500">Loading themes...</p>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400">
          {error}
          <button onClick={() => setError(null)} className="ml-2 underline">
            Dismiss
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {themes.map((theme) => (
          <div
            key={theme.name}
            className={`border rounded-xl overflow-hidden ${
              theme.active
                ? "border-zinc-900 dark:border-zinc-100 ring-1 ring-zinc-900 dark:ring-zinc-100"
                : "border-zinc-200 dark:border-zinc-800"
            }`}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold">{theme.name}</h3>
                    {theme.active && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium">
                        Active
                      </span>
                    )}
                    {theme.status === "error" && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 font-medium">
                        Error
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-zinc-500 mt-1">
                    v{theme.version} by {theme.author}
                  </p>
                </div>
              </div>

              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                {theme.description}
              </p>

              {theme.error && (
                <p className="text-xs text-red-500 mb-4 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                  {theme.error}
                </p>
              )}

              {theme.supportedFeatures.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {theme.supportedFeatures.map((feature) => (
                    <span
                      key={feature}
                      className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-3">
                {!theme.active && theme.status !== "error" && (
                  <button
                    onClick={() => handleAction(theme.name, "activate")}
                    className="px-4 py-2 text-sm font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
                  >
                    Activate
                  </button>
                )}
                {theme.active && (
                  <button
                    onClick={() => handleAction(theme.name, "deactivate")}
                    className="px-4 py-2 text-sm font-medium border border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    Deactivate
                  </button>
                )}
                <button
                  onClick={() => setConfiguring(theme.name)}
                  className="px-4 py-2 text-sm font-medium border border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  Configure
                </button>
                {theme.name !== "default" && (
                  <button
                    onClick={() => {
                      if (confirm(`Uninstall theme "${theme.name}"?`)) {
                        handleAction(theme.name, "uninstall");
                      }
                    }}
                    className="px-4 py-2 text-sm font-medium text-red-600 border border-red-300 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
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
        <div className="text-center py-20 text-zinc-500">
          <p className="text-lg font-medium mb-1">No themes installed</p>
          <p className="text-sm">
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
    <div className="border-t border-zinc-200 dark:border-zinc-800 p-6 bg-zinc-50 dark:bg-zinc-900/50">
      <h4 className="font-semibold mb-4">Configuration</h4>

      <div className="space-y-6">
        {groupedFields.map((group) => (
          <div key={group.key}>
            <h5 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3">
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

      <div className="flex items-center gap-3 mt-6 pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <button
          onClick={() => onSave(config)}
          className="px-4 py-2 text-sm font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
        >
          Save Configuration
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium border border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
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
              className="w-24 px-2 py-1 text-sm border border-zinc-300 dark:border-zinc-700 rounded bg-transparent"
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
            className="px-3 py-1.5 text-sm border border-zinc-300 dark:border-zinc-700 rounded bg-transparent"
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
              value
                ? "bg-zinc-900 dark:bg-zinc-100"
                : "bg-zinc-300 dark:bg-zinc-700"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white dark:bg-zinc-900 transition-transform ${
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
            className="w-20 px-2 py-1 text-sm border border-zinc-300 dark:border-zinc-700 rounded bg-transparent text-right"
          />
        </div>
      );

    case "font":
      return (
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">{field.label}</label>
          <select
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
            className="px-3 py-1.5 text-sm border border-zinc-300 dark:border-zinc-700 rounded bg-transparent"
          >
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      );

    default:
      return (
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">{field.label}</label>
          <input
            type="text"
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
            className="w-48 px-2 py-1 text-sm border border-zinc-300 dark:border-zinc-700 rounded bg-transparent"
          />
        </div>
      );
  }
}
