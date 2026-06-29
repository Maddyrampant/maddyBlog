"use client";

import type { Editor } from "@tiptap/react";
import AIActionMenu from "./ai/AIActionMenu";

type ToolbarProps = {
  editor: Editor | null;
};

export default function EditorToolbar({ editor }: ToolbarProps) {
  if (!editor) return null;

  const tools = [
    {
      label: "Bold",
      action: () => editor.chain().focus().toggleBold().run(),
      active: editor.isActive("bold"),
      icon: "B",
    },
    {
      label: "Italic",
      action: () => editor.chain().focus().toggleItalic().run(),
      active: editor.isActive("italic"),
      icon: "I",
    },
    {
      label: "Strike",
      action: () => editor.chain().focus().toggleStrike().run(),
      active: editor.isActive("strike"),
      icon: "S",
    },
    {
      label: "Code",
      action: () => editor.chain().focus().toggleCode().run(),
      active: editor.isActive("code"),
      icon: "<>",
    },
    { type: "divider" as const },
    {
      label: "H1",
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      active: editor.isActive("heading", { level: 1 }),
      icon: "H1",
    },
    {
      label: "H2",
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      active: editor.isActive("heading", { level: 2 }),
      icon: "H2",
    },
    {
      label: "H3",
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      active: editor.isActive("heading", { level: 3 }),
      icon: "H3",
    },
    { type: "divider" as const },
    {
      label: "Bullet List",
      action: () => editor.chain().focus().toggleBulletList().run(),
      active: editor.isActive("bulletList"),
      icon: "•",
    },
    {
      label: "Ordered List",
      action: () => editor.chain().focus().toggleOrderedList().run(),
      active: editor.isActive("orderedList"),
      icon: "1.",
    },
    {
      label: "Blockquote",
      action: () => editor.chain().focus().toggleBlockquote().run(),
      active: editor.isActive("blockquote"),
      icon: '"',
    },
    { type: "divider" as const },
    {
      label: "Code Block",
      action: () => editor.chain().focus().toggleCodeBlock().run(),
      active: editor.isActive("codeBlock"),
      icon: "{}",
    },
    {
      label: "Table",
      action: () =>
        editor
          .chain()
          .focus()
          .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
          .run(),
      active: editor.isActive("table"),
      icon: "⊞",
    },
    {
      label: "Image",
      action: () => {
        const url = window.prompt("Enter image URL:");
        if (url) editor.chain().focus().setImage({ src: url }).run();
      },
      active: false,
      icon: "🖼",
    },
    {
      label: "Link",
      action: () => {
        const url = window.prompt("Enter link URL:");
        if (url) editor.chain().focus().setLink({ href: url }).run();
      },
      active: editor.isActive("link"),
      icon: "🔗",
    },
    { type: "divider" as const },
    {
      label: "Undo",
      action: () => editor.chain().focus().undo().run(),
      active: false,
      icon: "↩",
    },
    {
      label: "Redo",
      action: () => editor.chain().focus().redo().run(),
      active: false,
      icon: "↪",
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 rounded-t-xl overflow-x-auto">
      <AIActionMenu editor={editor} />
      <div className="w-px h-5 mx-1 bg-zinc-300 dark:bg-zinc-700" />
      {tools.map((tool, i) =>
        "type" in tool ? (
          <div key={i} className="w-px h-5 mx-1 bg-zinc-300 dark:bg-zinc-700" />
        ) : (
          <button
            key={i}
            type="button"
            onClick={tool.action}
            title={tool.label}
            className={`px-2 py-1 text-xs font-mono rounded transition-colors ${
              tool.active
                ? "bg-zinc-800 text-white dark:bg-white dark:text-zinc-900"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800"
            }`}
          >
            {tool.icon}
          </button>
        ),
      )}
    </div>
  );
}
