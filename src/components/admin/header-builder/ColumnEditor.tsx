"use client";

import { useState } from "react";
import type {
  BuilderColumn,
  AlignmentSetting,
  BuilderElementType,
} from "@/lib/header-footer/types";
import { ElementEditor } from "./ElementEditor";
import { ElementSelector } from "./ElementSelector";
import { GripVertical, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { moveElement, createElement } from "./utils";

interface ColumnEditorProps {
  column: BuilderColumn;
  onChange: (column: BuilderColumn) => void;
  section: "header" | "footer";
}

export function ColumnEditor({ column, onChange, section }: ColumnEditorProps) {
  const [showElementSelector, setShowElementSelector] = useState(false);

  function updateElement(elId: string, updated: (typeof column.elements)[0]) {
    onChange({
      ...column,
      elements: column.elements.map((el) => (el.id === elId ? updated : el)),
    });
  }

  function deleteElement(elId: string) {
    onChange({
      ...column,
      elements: column.elements.filter((el) => el.id !== elId),
    });
  }

  function moveElementUp(idx: number) {
    if (idx === 0) return;
    onChange({
      ...column,
      elements: moveElement(column.elements, idx, idx - 1),
    });
  }

  function moveElementDown(idx: number) {
    if (idx === column.elements.length - 1) return;
    onChange({
      ...column,
      elements: moveElement(column.elements, idx, idx + 1),
    });
  }

  function addElement(type: BuilderElementType) {
    onChange({
      ...column,
      elements: [...column.elements, createElement(type)],
    });
    setShowElementSelector(false);
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <label className="text-xs font-medium text-zinc-500 block mb-1">
            Width ({column.width}/12)
          </label>
          <input
            type="range"
            min={1}
            max={12}
            value={column.width}
            onChange={(e) =>
              onChange({ ...column, width: Number(e.target.value) })
            }
            className="w-full accent-indigo-500"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-zinc-500 block mb-1">
            Align
          </label>
          <select
            value={column.alignment || "start"}
            onChange={(e) =>
              onChange({
                ...column,
                alignment: e.target.value as AlignmentSetting,
              })
            }
            className="admin-input text-xs py-1.5 px-2"
          >
            <option value="start">Start</option>
            <option value="center">Center</option>
            <option value="end">End</option>
            <option value="stretch">Stretch</option>
          </select>
        </div>
      </div>

      {column.elements.length > 0 && (
        <div className="space-y-1.5">
          {column.elements.map((el, idx) => (
            <div
              key={el.id}
              className="border border-zinc-200 dark:border-zinc-700 rounded-md bg-zinc-50 dark:bg-zinc-800/30"
            >
              <div className="flex items-center gap-1 px-2 py-1 bg-zinc-100 dark:bg-zinc-800/50 rounded-t-md border-b border-zinc-200 dark:border-zinc-700">
                <GripVertical size={12} className="text-zinc-300 shrink-0" />
                <span className="text-xs font-medium text-zinc-500 flex-1 truncate">
                  {el.type}
                </span>
                <button
                  onClick={() => moveElementUp(idx)}
                  disabled={idx === 0}
                  className="text-zinc-400 hover:text-zinc-600 disabled:opacity-30 disabled:cursor-not-allowed p-0.5"
                >
                  <ArrowUp size={12} />
                </button>
                <button
                  onClick={() => moveElementDown(idx)}
                  disabled={idx === column.elements.length - 1}
                  className="text-zinc-400 hover:text-zinc-600 disabled:opacity-30 disabled:cursor-not-allowed p-0.5"
                >
                  <ArrowDown size={12} />
                </button>
                <button
                  onClick={() => deleteElement(el.id)}
                  className="text-red-400 hover:text-red-500 p-0.5"
                >
                  <Trash2 size={12} />
                </button>
              </div>
              <div className="p-2">
                <ElementEditor
                  element={el}
                  onChange={(updated) => updateElement(el.id, updated)}
                  section={section}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {showElementSelector ? (
        <ElementSelector
          section={section}
          onSelect={addElement}
          onClose={() => setShowElementSelector(false)}
        />
      ) : (
        <button
          onClick={() => setShowElementSelector(true)}
          className="w-full py-2 border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-md text-xs font-medium text-zinc-400 hover:border-indigo-400 hover:text-indigo-500 transition-colors"
        >
          + Add Element
        </button>
      )}
    </div>
  );
}
