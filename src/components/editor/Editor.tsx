"use client";

import { useState } from "react";
import { useEditor, EditorContent as TiptapEditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import LinkExtension from "@tiptap/extension-link";
import PlaceholderExtension from "@tiptap/extension-placeholder";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import UnderlineExtension from "@tiptap/extension-underline";
import { common, createLowlight } from "lowlight";
import EditorToolbar from "./EditorToolbar";
import SlashCommandMenu from "./SlashCommandMenu";
import ImageUploader from "./ImageUploader";
import LivePreview from "./LivePreview";
import { calculateReadingTime, formatReadingTime } from "@/lib/readingTime";

const lowlight = createLowlight(common);

type EditorProps = {
  initialContent?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
};

export default function Editor({
  initialContent = "",
  onChange,
  placeholder = "Start writing...",
}: EditorProps) {
  const [slashMenuOpen, setSlashMenuOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [html, setHtml] = useState(initialContent);
  const [readingTime, setReadingTime] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      UnderlineExtension,
      ImageExtension,
      LinkExtension.configure({
        openOnClick: false,
      }),
      PlaceholderExtension.configure({
        placeholder,
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content: initialContent,
    onUpdate: ({ editor: ed }) => {
      const htmlContent = ed.getHTML();
      setHtml(htmlContent);
      onChange?.(htmlContent);
      setReadingTime(calculateReadingTime(ed.getText()));
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-zinc dark:prose-invert prose-lg max-w-none focus:outline-none min-h-[400px] px-6 py-5",
      },
      handleKeyDown: (_view, event) => {
        if (event.key === "/" && !slashMenuOpen) {
          setTimeout(() => setSlashMenuOpen(true), 0);
        }
        if (event.key === "Escape" && slashMenuOpen) {
          setSlashMenuOpen(false);
        }
        return false;
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="flex flex-col lg:flex-row gap-0 lg:gap-6">
      <div className="flex-1 min-w-0">
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 shadow-sm">
          <EditorToolbar editor={editor} />

          <ImageUploader editor={editor}>
            <div className="relative">
              <SlashCommandMenu
                editor={editor}
                isOpen={slashMenuOpen}
                onClose={() => setSlashMenuOpen(false)}
              />

              <TiptapEditorContent editor={editor} />
            </div>
          </ImageUploader>
        </div>

        <div className="flex items-center justify-between mt-3 text-xs text-zinc-500">
          <span>
            {formatReadingTime(
              readingTime || calculateReadingTime(editor.getText()),
            )}
          </span>
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="px-3 py-1 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            {showPreview ? "Editor" : "Preview"}
          </button>
        </div>
      </div>

      {showPreview && (
        <div className="flex-1 min-w-0 lg:max-w-[50%]">
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 p-6 min-h-[400px] overflow-auto">
            <LivePreview content={html} />
          </div>
        </div>
      )}
    </div>
  );
}
