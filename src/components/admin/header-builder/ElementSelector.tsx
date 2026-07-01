"use client";

import type { BuilderElementType } from "@/lib/header-footer/types";
import { availableHeaderElements, availableFooterElements } from "./utils";
import { X } from "lucide-react";

interface ElementSelectorProps {
  section: "header" | "footer";
  onSelect: (type: BuilderElementType) => void;
  onClose: () => void;
}

export function ElementSelector({
  section,
  onSelect,
  onClose,
}: ElementSelectorProps) {
  const elements =
    section === "header" ? availableHeaderElements : availableFooterElements;

  return (
    <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 p-3">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
          Add Element
        </span>
        <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600">
          <X size={14} />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {elements.map((el) => (
          <button
            key={el.type}
            onClick={() => onSelect(el.type)}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-200 hover:shadow-sm transition-all"
          >
            <span className="text-base shrink-0">{el.icon}</span>
            <span className="truncate">{el.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
