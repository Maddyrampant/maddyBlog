"use client";

import type {
  HeaderConfig,
  FooterConfig,
  BuilderRow,
} from "@/lib/header-footer/types";
import { RowEditor } from "./RowEditor";
import { GlobalSettings } from "./GlobalSettings";
import { createRow, moveElement } from "./utils";
import { Plus, ArrowUp, ArrowDown, LayoutTemplate } from "lucide-react";

interface BuilderPanelProps {
  header: HeaderConfig;
  footer: FooterConfig;
  section: "header" | "footer";
  onChange: (header: HeaderConfig, footer: FooterConfig) => void;
}

export function BuilderPanel({
  header,
  footer,
  section,
  onChange,
}: BuilderPanelProps) {
  if (section === "header") {
    function updateTopRow(row: BuilderRow | null) {
      onChange({ ...header, topRow: row }, footer);
    }

    function updateMainRow(row: BuilderRow) {
      onChange({ ...header, mainRow: row }, footer);
    }

    function updateBottomRow(row: BuilderRow | null) {
      onChange({ ...header, bottomRow: row }, footer);
    }

    return (
      <div className="space-y-4">
        <div className="rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700">
          <button
            onClick={() =>
              updateTopRow(
                header.topRow
                  ? null
                  : {
                      ...createRow(),
                      settings: {
                        ...createRow().settings,
                        height: 32,
                        paddingY: 6,
                      },
                    },
              )
            }
            className="flex items-center gap-2 w-full px-4 py-2.5 text-xs font-medium text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <LayoutTemplate size={14} />
            {header.topRow ? "Hide Top Row" : "Show Top Row"}
          </button>
        </div>

        {header.topRow && (
          <div className="relative pl-3 border-l-2 border-indigo-300 dark:border-indigo-700">
            <div className="absolute -left-[9px] top-3 w-4 h-4 rounded-full bg-indigo-100 dark:bg-indigo-900 border-2 border-indigo-300 dark:border-indigo-700 flex items-center justify-center">
              <span className="text-[8px] text-indigo-600 dark:text-indigo-300 font-bold">
                T
              </span>
            </div>
            <RowEditor
              row={header.topRow}
              onChange={updateTopRow}
              onDelete={() => updateTopRow(null)}
              section="header"
            />
          </div>
        )}

        <div className="relative pl-3 border-l-2 border-indigo-500 dark:border-indigo-400">
          <div className="absolute -left-[9px] top-3 w-4 h-4 rounded-full bg-indigo-500 border-2 border-indigo-500 flex items-center justify-center">
            <span className="text-[8px] text-white font-bold">M</span>
          </div>
          <RowEditor
            row={header.mainRow}
            onChange={updateMainRow}
            section="header"
          />
        </div>

        <div className="rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700">
          <button
            onClick={() =>
              updateBottomRow(
                header.bottomRow
                  ? null
                  : {
                      ...createRow(),
                      settings: {
                        ...createRow().settings,
                        height: 32,
                        paddingY: 6,
                      },
                    },
              )
            }
            className="flex items-center gap-2 w-full px-4 py-2.5 text-xs font-medium text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <LayoutTemplate size={14} />
            {header.bottomRow ? "Hide Bottom Row" : "Show Bottom Row"}
          </button>
        </div>

        {header.bottomRow && (
          <div className="relative pl-3 border-l-2 border-indigo-300 dark:border-indigo-700">
            <div className="absolute -left-[9px] top-3 w-4 h-4 rounded-full bg-indigo-100 dark:bg-indigo-900 border-2 border-indigo-300 dark:border-indigo-700 flex items-center justify-center">
              <span className="text-[8px] text-indigo-600 dark:text-indigo-300 font-bold">
                B
              </span>
            </div>
            <RowEditor
              row={header.bottomRow}
              onChange={updateBottomRow}
              onDelete={() => updateBottomRow(null)}
              section="header"
            />
          </div>
        )}

        <GlobalSettings
          header={header}
          footer={footer}
          section="header"
          onChange={onChange}
        />
      </div>
    );
  }

  function addRow() {
    onChange(header, {
      ...footer,
      rows: [...footer.rows, createRow()],
    });
  }

  function updateRow(idx: number, row: BuilderRow) {
    const rows = [...footer.rows];
    rows[idx] = row;
    onChange(header, { ...footer, rows });
  }

  function deleteRow(idx: number) {
    if (footer.rows.length <= 1) return;
    const rows = footer.rows.filter((_, i) => i !== idx);
    onChange(header, { ...footer, rows });
  }

  function moveRowUp(idx: number) {
    if (idx === 0) return;
    onChange(header, {
      ...footer,
      rows: moveElement(footer.rows, idx, idx - 1),
    });
  }

  function moveRowDown(idx: number) {
    if (idx === footer.rows.length - 1) return;
    onChange(header, {
      ...footer,
      rows: moveElement(footer.rows, idx, idx + 1),
    });
  }

  return (
    <div className="space-y-4">
      {footer.rows.map((row, idx) => (
        <div
          key={row.id}
          className="relative pl-3 border-l-2 border-zinc-300 dark:border-zinc-600"
        >
          <div className="absolute -left-[9px] top-3 w-4 h-4 rounded-full bg-zinc-200 dark:bg-zinc-700 border-2 border-zinc-300 dark:border-zinc-600 flex items-center justify-center">
            <span className="text-[8px] text-zinc-500 dark:text-zinc-400 font-bold">
              {idx + 1}
            </span>
          </div>
          <div className="flex gap-1 mb-2">
            <button
              onClick={() => moveRowUp(idx)}
              disabled={idx === 0}
              className="admin-btn admin-btn-xs admin-btn-outline disabled:opacity-30"
            >
              <ArrowUp size={12} />
            </button>
            <button
              onClick={() => moveRowDown(idx)}
              disabled={idx === footer.rows.length - 1}
              className="admin-btn admin-btn-xs admin-btn-outline disabled:opacity-30"
            >
              <ArrowDown size={12} />
            </button>
          </div>
          <RowEditor
            row={row}
            index={idx}
            onChange={(r) => updateRow(idx, r)}
            onDelete={footer.rows.length > 1 ? () => deleteRow(idx) : undefined}
            section="footer"
          />
        </div>
      ))}

      <button
        onClick={addRow}
        className="w-full py-3 border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-lg text-xs font-medium text-zinc-400 hover:border-indigo-400 hover:text-indigo-500 transition-colors flex items-center justify-center gap-2"
      >
        <Plus size={14} />
        Add Row
      </button>

      <GlobalSettings
        header={header}
        footer={footer}
        section="footer"
        onChange={onChange}
      />
    </div>
  );
}
