"use client";

import type { HeaderConfig, FooterConfig } from "@/lib/header-footer/types";
import { Settings2 } from "lucide-react";

interface GlobalSettingsProps {
  header: HeaderConfig;
  footer: FooterConfig;
  section: "header" | "footer";
  onChange: (header: HeaderConfig, footer: FooterConfig) => void;
}

export function GlobalSettings({
  header,
  footer,
  section,
  onChange,
}: GlobalSettingsProps) {
  if (section === "header") {
    const s = header.settings;

    function updateHeaderSetting(key: string, value: unknown) {
      onChange(
        { ...header, settings: { ...header.settings, [key]: value } },
        footer,
      );
    }

    return (
      <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800/50 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
          <Settings2 size={14} className="text-zinc-400" />
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Header Settings
          </span>
        </div>
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-zinc-500 block mb-1">
                Background
              </label>
              <div className="flex gap-1">
                <input
                  type="color"
                  value={s.backgroundColor || "#ffffff"}
                  onChange={(e) =>
                    updateHeaderSetting("backgroundColor", e.target.value)
                  }
                  className="w-8 h-8 rounded border border-zinc-200 dark:border-zinc-700 cursor-pointer shrink-0"
                />
                <input
                  type="text"
                  value={s.backgroundColor || ""}
                  onChange={(e) =>
                    updateHeaderSetting("backgroundColor", e.target.value)
                  }
                  className="admin-input text-xs flex-1"
                  placeholder="transparent"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-500 block mb-1">
                Text Color
              </label>
              <div className="flex gap-1">
                <input
                  type="color"
                  value={s.textColor || "#000000"}
                  onChange={(e) =>
                    updateHeaderSetting("textColor", e.target.value)
                  }
                  className="w-8 h-8 rounded border border-zinc-200 dark:border-zinc-700 cursor-pointer shrink-0"
                />
                <input
                  type="text"
                  value={s.textColor || ""}
                  onChange={(e) =>
                    updateHeaderSetting("textColor", e.target.value)
                  }
                  className="admin-input text-xs flex-1"
                  placeholder="inherit"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-zinc-500 block mb-1">
                Height (px)
              </label>
              <input
                type="number"
                value={s.height}
                onChange={(e) =>
                  updateHeaderSetting("height", Number(e.target.value))
                }
                className="admin-input text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-500 block mb-1">
                Border Bottom
              </label>
              <input
                type="text"
                value={s.borderBottom || ""}
                onChange={(e) =>
                  updateHeaderSetting("borderBottom", e.target.value)
                }
                className="admin-input text-xs"
                placeholder="none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-500 block mb-1">
              Box Shadow
            </label>
            <input
              type="text"
              value={s.boxShadow || ""}
              onChange={(e) => updateHeaderSetting("boxShadow", e.target.value)}
              className="admin-input text-xs"
              placeholder="none"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 cursor-pointer">
              <input
                type="checkbox"
                checked={s.sticky}
                onChange={(e) =>
                  updateHeaderSetting("sticky", e.target.checked)
                }
                className="rounded border-zinc-300 dark:border-zinc-600"
              />
              Sticky
            </label>
            <label className="flex items-center gap-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 cursor-pointer">
              <input
                type="checkbox"
                checked={s.stickyOnMobile}
                onChange={(e) =>
                  updateHeaderSetting("stickyOnMobile", e.target.checked)
                }
                className="rounded border-zinc-300 dark:border-zinc-600"
              />
              Sticky on Mobile
            </label>
            <label className="flex items-center gap-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 cursor-pointer">
              <input
                type="checkbox"
                checked={s.transparent}
                onChange={(e) =>
                  updateHeaderSetting("transparent", e.target.checked)
                }
                className="rounded border-zinc-300 dark:border-zinc-600"
              />
              Transparent
            </label>
          </div>
        </div>
      </div>
    );
  }

  const s = footer.settings;

  function updateFooterSetting(key: string, value: unknown) {
    onChange(header, {
      ...footer,
      settings: { ...footer.settings, [key]: value },
    });
  }

  return (
    <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800/50 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
        <Settings2 size={14} className="text-zinc-400" />
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Footer Settings
        </span>
      </div>
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-zinc-500 block mb-1">
              Background
            </label>
            <div className="flex gap-1">
              <input
                type="color"
                value={s.backgroundColor || "#ffffff"}
                onChange={(e) =>
                  updateFooterSetting("backgroundColor", e.target.value)
                }
                className="w-8 h-8 rounded border border-zinc-200 dark:border-zinc-700 cursor-pointer shrink-0"
              />
              <input
                type="text"
                value={s.backgroundColor || ""}
                onChange={(e) =>
                  updateFooterSetting("backgroundColor", e.target.value)
                }
                className="admin-input text-xs flex-1"
                placeholder="transparent"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-zinc-500 block mb-1">
              Text Color
            </label>
            <div className="flex gap-1">
              <input
                type="color"
                value={s.textColor || "#000000"}
                onChange={(e) =>
                  updateFooterSetting("textColor", e.target.value)
                }
                className="w-8 h-8 rounded border border-zinc-200 dark:border-zinc-700 cursor-pointer shrink-0"
              />
              <input
                type="text"
                value={s.textColor || ""}
                onChange={(e) =>
                  updateFooterSetting("textColor", e.target.value)
                }
                className="admin-input text-xs flex-1"
                placeholder="inherit"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-zinc-500 block mb-1">
              Padding Top (px)
            </label>
            <input
              type="number"
              value={s.paddingTop}
              onChange={(e) =>
                updateFooterSetting("paddingTop", Number(e.target.value))
              }
              className="admin-input text-xs"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-zinc-500 block mb-1">
              Padding Bottom (px)
            </label>
            <input
              type="number"
              value={s.paddingBottom}
              onChange={(e) =>
                updateFooterSetting("paddingBottom", Number(e.target.value))
              }
              className="admin-input text-xs"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-zinc-500 block mb-1">
            Border Top
          </label>
          <input
            type="text"
            value={s.borderTop || ""}
            onChange={(e) => updateFooterSetting("borderTop", e.target.value)}
            className="admin-input text-xs"
            placeholder="none"
          />
        </div>
      </div>
    </div>
  );
}
