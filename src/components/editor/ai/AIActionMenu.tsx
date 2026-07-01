"use client";

import { useState, useRef, useEffect } from "react";
import type { Editor } from "@tiptap/react";
import { useAIStream } from "./useAIStream";

type AIActionMenuProps = {
  editor: Editor;
};

type AIAction = {
  label: string;
  description: string;
  endpoint: string;
  kind: "replace" | "insert" | "title";
};

const actions: AIAction[] = [
  {
    label: "Rewrite",
    description: "Improve selected text",
    endpoint: "/api/ai/rewrite/stream",
    kind: "replace",
  },
  {
    label: "Expand",
    description: "Expand the paragraph",
    endpoint: "/api/ai/expand",
    kind: "replace",
  },
  {
    label: "Summarize",
    description: "Summarize selection",
    endpoint: "/api/ai/summarize",
    kind: "replace",
  },
  {
    label: "Improve Readability",
    description: "Simplify and clarify",
    endpoint: "/api/ai/rewrite/stream",
    kind: "replace",
  },
  {
    label: "Generate Title",
    description: "Create a title from content",
    endpoint: "/api/ai/generate-title",
    kind: "title",
  },
  {
    label: "Translate",
    description: "Translate selected text",
    endpoint: "/api/ai/translate",
    kind: "replace",
  },
];

export default function AIActionMenu({ editor }: AIActionMenuProps) {
  const [open, setOpen] = useState(false);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const { streamAI, streaming, cancel } = useAIStream({
    onChunk: (chunk) => {
      if (
        activeAction === "rewrite" ||
        activeAction === "expand" ||
        activeAction === "summarize" ||
        activeAction === "improve_readability"
      ) {
        const { from, to } = editor.state.selection;
        if (from !== to) {
          editor
            .chain()
            .focus()
            .deleteRange({ from, to })
            .insertContent(chunk)
            .run();
        } else {
          editor.chain().focus().insertContent(chunk).run();
        }
      }
    },
    onDone: () => {
      setActiveAction(null);
    },
  });

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleAction(action: AIAction) {
    setOpen(false);
    setActiveAction(action.label);

    const selectedText = editor.state.doc.textBetween(
      editor.state.selection.from,
      editor.state.selection.to,
    );

    if (!selectedText && action.kind !== "title") {
      alert("Please select some text first.");
      setActiveAction(null);
      return;
    }

    const content = action.kind === "title" ? editor.getText() : selectedText;

    if (action.label === "Translate") {
      const targetLanguage = prompt("Translate to language (e.g., persian, spanish, french, german):");
      if (!targetLanguage) { setActiveAction(null); return; }
      streamAI(action.endpoint, {
        text: content,
        targetLanguage: targetLanguage.toLowerCase().trim(),
        action: "translate",
      });
    } else if (action.kind === "replace") {
      streamAI(action.endpoint, {
        text: content,
        action:
          action.label === "Improve Readability"
            ? "improve_readability"
            : action.endpoint.split("/").pop(),
      });
    } else {
      const resp = await fetch(action.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (resp.ok) {
        const data = await resp.json();
        if (data.title) {
          editor.chain().focus().insertContent(data.title).run();
        }
      }
      setActiveAction(null);
    }
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        disabled={streaming}
        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
          streaming
            ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 animate-pulse"
            : "bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600"
        }`}
      >
        {streaming ? (
          <>
            <span className="inline-block w-2 h-2 bg-purple-500 rounded-full animate-bounce" />
            AI Working...
          </>
        ) : (
          <>
            <span className="text-sm">&#9670;</span>
            AI
          </>
        )}
      </button>

      {open && !streaming && (
        <div className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-xl z-50 py-1">
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={() => handleAction(action)}
              className="w-full text-left px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <div className="font-medium">{action.label}</div>
              <div className="text-xs text-zinc-400">{action.description}</div>
            </button>
          ))}
        </div>
      )}

      {streaming && (
        <button
          type="button"
          onClick={cancel}
          className="absolute top-full left-0 mt-1 px-4 py-2 text-xs text-red-600 dark:text-red-400 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-lg hover:bg-red-50 dark:hover:bg-red-900/20 whitespace-nowrap"
        >
          Cancel
        </button>
      )}
    </div>
  );
}
