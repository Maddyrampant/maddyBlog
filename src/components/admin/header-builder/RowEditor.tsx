"use client";

import type { BuilderRow } from "@/lib/header-footer/types";
import { ColumnEditor } from "./ColumnEditor";
import { Plus, Trash2, Columns } from "lucide-react";

interface RowEditorProps {
  row: BuilderRow;
  index?: number;
  onChange: (row: BuilderRow) => void;
  onDelete?: () => void;
  section: "header" | "footer";
}

export function RowEditor({
  row,
  onChange,
  onDelete,
  section,
}: RowEditorProps) {
  function updateSetting(key: string, value: unknown) {
    onChange({ ...row, settings: { ...row.settings, [key]: value } });
  }

  function addColumn() {
    const newCol = {
      id: crypto.randomUUID?.() ?? Math.random().toString(36).substring(2, 11),
      width: Math.max(1, Math.floor(12 / (row.columns.length + 1))),
      elements: [],
      alignment: "start" as const,
    };
    const redistributed = row.columns.map((c) => ({
      ...c,
      width: Math.max(1, Math.floor(12 / (row.columns.length + 1))),
    }));
    onChange({ ...row, columns: [...redistributed, newCol] });
  }

  function removeColumn(colId: string) {
    if (row.columns.length <= 1) return;
    const filtered = row.columns.filter((c) => c.id !== colId);
    const redistributed = filtered.map((c) => ({
      ...c,
      width: Math.max(1, Math.floor(12 / filtered.length)),
    }));
    onChange({ ...row, columns: redistributed });
  }

  function updateColumn(colId: string, updated: (typeof row.columns)[0]) {
    onChange({
      ...row,
      columns: row.columns.map((c) => (c.id === colId ? updated : c)),
    });
  }

  const open = row.settings;

  return (
    <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800/50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
        <div className="flex items-center gap-2">
          <Columns size={14} className="text-zinc-400" />
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Row
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={addColumn}
            className="admin-btn admin-btn-xs admin-btn-outline"
            title="Add column"
          >
            <Plus size={12} /> Column
          </button>
          {onDelete && (
            <button
              onClick={onDelete}
              className="admin-btn admin-btn-xs admin-btn-danger"
              title="Delete row"
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
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
                value={open.backgroundColor || "#ffffff"}
                onChange={(e) =>
                  updateSetting("backgroundColor", e.target.value)
                }
                className="w-8 h-8 rounded border border-zinc-200 dark:border-zinc-700 cursor-pointer shrink-0"
              />
              <input
                type="text"
                value={open.backgroundColor || ""}
                onChange={(e) =>
                  updateSetting("backgroundColor", e.target.value)
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
                value={open.textColor || "#000000"}
                onChange={(e) => updateSetting("textColor", e.target.value)}
                className="w-8 h-8 rounded border border-zinc-200 dark:border-zinc-700 cursor-pointer shrink-0"
              />
              <input
                type="text"
                value={open.textColor || ""}
                onChange={(e) => updateSetting("textColor", e.target.value)}
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
              value={open.height ?? ""}
              onChange={(e) =>
                updateSetting(
                  "height",
                  e.target.value ? Number(e.target.value) : undefined,
                )
              }
              className="admin-input text-xs"
              placeholder="Auto"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-zinc-500 block mb-1">
              Max Width
            </label>
            <input
              type="text"
              value={open.maxWidth || ""}
              onChange={(e) => updateSetting("maxWidth", e.target.value)}
              className="admin-input text-xs"
              placeholder="1200px"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-zinc-500 block mb-1">
              Padding Y (px)
            </label>
            <input
              type="number"
              value={open.paddingY ?? ""}
              onChange={(e) =>
                updateSetting(
                  "paddingY",
                  e.target.value ? Number(e.target.value) : undefined,
                )
              }
              className="admin-input text-xs"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-zinc-500 block mb-1">
              Padding X (px)
            </label>
            <input
              type="number"
              value={open.paddingX ?? ""}
              onChange={(e) =>
                updateSetting(
                  "paddingX",
                  e.target.value ? Number(e.target.value) : undefined,
                )
              }
              className="admin-input text-xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-zinc-500 block mb-1">
              Border Top
            </label>
            <input
              type="text"
              value={open.borderTop || ""}
              onChange={(e) => updateSetting("borderTop", e.target.value)}
              className="admin-input text-xs"
              placeholder="none"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-zinc-500 block mb-1">
              Border Bottom
            </label>
            <input
              type="text"
              value={open.borderBottom || ""}
              onChange={(e) => updateSetting("borderBottom", e.target.value)}
              className="admin-input text-xs"
              placeholder="none"
            />
          </div>
        </div>

        {section === "header" && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`sticky-${row.id}`}
              checked={open.sticky ?? false}
              onChange={(e) => updateSetting("sticky", e.target.checked)}
              className="rounded border-zinc-300 dark:border-zinc-600"
            />
            <label
              htmlFor={`sticky-${row.id}`}
              className="text-xs font-medium text-zinc-500"
            >
              Sticky row
            </label>
          </div>
        )}

        <div>
          <label className="text-xs font-medium text-zinc-500 block mb-1">
            Visibility
          </label>
          <div className="flex gap-3 text-xs">
            {(["desktop", "tablet", "mobile"] as const).map((d) => (
              <label
                key={d}
                className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={open.visible[d]}
                  onChange={(e) =>
                    updateSetting("visible", {
                      ...open.visible,
                      [d]: e.target.checked,
                    })
                  }
                  className="rounded border-zinc-300 dark:border-zinc-600"
                />
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-200 dark:border-zinc-700 divide-y divide-zinc-100 dark:divide-zinc-700/50">
        {row.columns.map((col, idx) => (
          <div key={col.id} className="p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Column {idx + 1}
              </span>
              {row.columns.length > 1 && (
                <button
                  onClick={() => removeColumn(col.id)}
                  className="text-red-400 hover:text-red-500 text-xs font-medium transition-colors"
                >
                  Remove
                </button>
              )}
            </div>
            <ColumnEditor
              column={col}
              onChange={(updated) => updateColumn(col.id, updated)}
              section={section}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
