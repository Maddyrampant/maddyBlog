"use client";

import type {
  BuilderElement,
  BuilderElementType,
} from "@/lib/header-footer/types";
import { availableHeaderElements, availableFooterElements } from "./utils";

interface ElementEditorProps {
  element: BuilderElement;
  onChange: (element: BuilderElement) => void;
  section: "header" | "footer";
}

export function ElementEditor({
  element,
  onChange,
  section,
}: ElementEditorProps) {
  const availableTypes =
    section === "header" ? availableHeaderElements : availableFooterElements;

  function updateField(key: string, value: unknown) {
    onChange({ ...element, [key]: value });
  }

  const showContent = [
    "logo",
    "text",
    "html",
    "button",
    "copyright",
    "newsletter",
    "nav-menu",
  ].includes(element.type);
  const showLink = ["button", "logo"].includes(element.type);

  return (
    <div className="space-y-2">
      <div>
        <label className="text-xs font-medium text-zinc-500 block mb-0.5">
          Type
        </label>
        <select
          value={element.type}
          onChange={(e) => {
            const newType = e.target.value as BuilderElementType;
            const typeInfo = availableTypes.find((t) => t.type === newType);
            onChange({
              ...element,
              type: newType,
              content:
                typeInfo &&
                [
                  "logo",
                  "text",
                  "html",
                  "button",
                  "copyright",
                  "newsletter",
                  "nav-menu",
                ].includes(newType)
                  ? element.content || ""
                  : undefined,
              link: ["button", "logo"].includes(newType)
                ? element.link || "#"
                : undefined,
            });
          }}
          className="admin-input text-xs"
        >
          {availableTypes.map((t) => (
            <option key={t.type} value={t.type}>
              {t.icon} {t.label}
            </option>
          ))}
        </select>
      </div>

      {showContent && (
        <div>
          <label className="text-xs font-medium text-zinc-500 block mb-0.5">
            {element.type === "nav-menu"
              ? "Menu Items (comma separated)"
              : element.type === "newsletter"
                ? "Placeholder / Button text"
                : element.type === "html"
                  ? "HTML Content"
                  : "Content"}
          </label>
          {element.type === "html" ? (
            <textarea
              value={element.content || ""}
              onChange={(e) => updateField("content", e.target.value)}
              className="admin-input text-xs resize-none"
              rows={3}
            />
          ) : (
            <input
              type="text"
              value={element.content || ""}
              onChange={(e) => updateField("content", e.target.value)}
              className="admin-input text-xs"
            />
          )}
        </div>
      )}

      {showLink && (
        <div>
          <label className="text-xs font-medium text-zinc-500 block mb-0.5">
            Link URL
          </label>
          <input
            type="text"
            value={element.link || ""}
            onChange={(e) => updateField("link", e.target.value)}
            className="admin-input text-xs"
            placeholder="https://..."
          />
        </div>
      )}

      <div>
        <label className="text-xs font-medium text-zinc-500 block mb-0.5">
          CSS Class
        </label>
        <input
          type="text"
          value={element.className || ""}
          onChange={(e) => updateField("className", e.target.value)}
          className="admin-input text-xs"
          placeholder="Optional class name"
        />
      </div>

      <div>
        <label className="text-xs font-medium text-zinc-500 block mb-0.5">
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
                checked={element.visibility[d]}
                onChange={(e) =>
                  updateField("visibility", {
                    ...element.visibility,
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
  );
}
