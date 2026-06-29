"use client";

import { useCallback, useState } from "react";
import type { Editor } from "@tiptap/react";

type ImageUploaderProps = {
  editor: Editor | null;
  children?: React.ReactNode;
};

export default function ImageUploader({
  editor,
  children,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const uploadImage = useCallback(
    async (file: File) => {
      if (!editor) return;

      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();

        if (data.url) {
          editor.chain().focus().setImage({ src: data.url }).run();
        }
      } catch {
        // silently fail
      }
    },
    [editor],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      const imageFiles = files.filter((f) => f.type.startsWith("image/"));

      for (const file of imageFiles) {
        uploadImage(file);
      }
    },
    [uploadImage],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`relative transition-colors ${isDragging ? "ring-2 ring-blue-500 ring-offset-2 rounded-xl" : ""}`}
    >
      {children}

      {isDragging && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-zinc-900/80 rounded-xl z-50">
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
            Drop image to upload
          </p>
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) uploadImage(file);
        }}
        className="hidden"
        id="editor-image-input"
      />
      <label htmlFor="editor-image-input" className="cursor-pointer">
        {/* trigger via toolbar button */}
      </label>
    </div>
  );
}
