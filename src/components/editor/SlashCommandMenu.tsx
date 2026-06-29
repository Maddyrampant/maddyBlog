"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import type { Editor } from "@tiptap/react";

type Command = {
  title: string;
  description: string;
  icon: string;
  action: (editor: Editor) => void;
};

const commands: Command[] = [
  {
    title: "Heading 1",
    description: "Large section heading",
    icon: "H1",
    action: (editor) =>
      editor.chain().focus().toggleHeading({ level: 1 }).run(),
  },
  {
    title: "Heading 2",
    description: "Medium section heading",
    icon: "H2",
    action: (editor) =>
      editor.chain().focus().toggleHeading({ level: 2 }).run(),
  },
  {
    title: "Heading 3",
    description: "Small section heading",
    icon: "H3",
    action: (editor) =>
      editor.chain().focus().toggleHeading({ level: 3 }).run(),
  },
  {
    title: "Image",
    description: "Insert an image",
    icon: "🖼",
    action: (editor) => {
      const url = window.prompt("Enter image URL:");
      if (url) editor.chain().focus().setImage({ src: url }).run();
    },
  },
  {
    title: "Code Block",
    description: "Insert a code block",
    icon: "{}",
    action: (editor) => editor.chain().focus().toggleCodeBlock().run(),
  },
  {
    title: "Blockquote",
    description: "Insert a blockquote",
    icon: '"',
    action: (editor) => editor.chain().focus().toggleBlockquote().run(),
  },
  {
    title: "Bullet List",
    description: "Insert a bullet list",
    icon: "•",
    action: (editor) => editor.chain().focus().toggleBulletList().run(),
  },
  {
    title: "Ordered List",
    description: "Insert a numbered list",
    icon: "1.",
    action: (editor) => editor.chain().focus().toggleOrderedList().run(),
  },
  {
    title: "Table",
    description: "Insert a table",
    icon: "⊞",
    action: (editor) =>
      editor
        .chain()
        .focus()
        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
        .run(),
  },
];

type SlashCommandMenuProps = {
  editor: Editor | null;
  isOpen: boolean;
  onClose: () => void;
};

export default function SlashCommandMenu({
  editor,
  isOpen,
  onClose,
}: SlashCommandMenuProps) {
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  const filtered = commands.filter(
    (cmd) =>
      cmd.title.toLowerCase().includes(search.toLowerCase()) ||
      cmd.description.toLowerCase().includes(search.toLowerCase()),
  );

  const safeIndex = Math.min(selectedIndex, Math.max(0, filtered.length - 1));

  const execute = useCallback(
    (cmd: Command) => {
      if (!editor) return;
      cmd.action(editor);
      onClose();
      setSearch("");
    },
    [editor, onClose],
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setSelectedIndex(0);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filtered.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(
          (prev) => (prev - 1 + filtered.length) % filtered.length,
        );
      } else if (e.key === "Enter" && filtered[safeIndex]) {
        e.preventDefault();
        execute(filtered[safeIndex]);
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filtered, safeIndex, execute, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="absolute z-50 w-72 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl overflow-hidden"
      style={{ bottom: "100%", marginBottom: "4px" }}
    >
      <div className="px-3 pt-2 pb-1">
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Filter commands..."
          className="w-full px-3 py-1.5 text-sm border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-800 outline-none focus:ring-1 focus:ring-zinc-400"
          autoFocus
        />
      </div>
      <div className="max-h-64 overflow-y-auto p-1">
        {filtered.map((cmd, i) => (
          <button
            key={cmd.title}
            type="button"
            onClick={() => execute(cmd)}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
              i === safeIndex
                ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
            }`}
          >
            <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 text-sm">
              {cmd.icon}
            </span>
            <div className="text-left">
              <p className="font-medium text-zinc-800 dark:text-zinc-200">
                {cmd.title}
              </p>
              <p className="text-xs text-zinc-500">{cmd.description}</p>
            </div>
          </button>
        ))}
        {filtered.length === 0 && (
          <p className="px-3 py-4 text-sm text-zinc-500 text-center">
            No commands found
          </p>
        )}
      </div>
    </div>
  );
}
