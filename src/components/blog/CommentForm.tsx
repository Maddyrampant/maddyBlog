"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

type CommentFormProps = {
  postId: string;
  parentId?: string;
  onCancel?: () => void;
};

export default function CommentForm({ postId, parentId, onCancel }: CommentFormProps) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (parentId && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [parentId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    setSending(true);
    setError("");

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim(), postId, parentId }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "خطا در ثبت نظر");
      }

      setContent("");
      onCancel?.();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در ثبت نظر");
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={parentId ? "پاسخ خود را بنویسید..." : "نظر خود را بنویسید..."}
        rows={4}
        className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={sending || !content.trim()}
          className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {sending ? "در حال ارسال..." : "ارسال نظر"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
          >
            انصراف
          </button>
        )}
      </div>
      <p className="text-xs text-zinc-400">
        برای ارسال نظر باید <a href="/login" className="underline">وارد شوید</a>.
      </p>
    </form>
  );
}
