"use client";

import { useState } from "react";

type CommentFormProps = {
  postId: string;
  parentId?: string;
  onSuccess?: () => void;
};

export default function DefaultCommentForm({
  postId,
  parentId,
  onSuccess,
}: CommentFormProps) {
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, content: content.trim(), parentId }),
      });

      if (!res.ok) throw new Error("Failed to post comment");
      setStatus("success");
      setContent("");
      onSuccess?.();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className="text-sm text-green-600 dark:text-green-400">
        Comment posted successfully!
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={parentId ? "Write a reply..." : "Write a comment..."}
        rows={4}
        className="w-full px-4 py-3 text-sm border border-zinc-300 dark:border-zinc-700 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-500 resize-none"
        required
      />
      <div className="flex items-center justify-between mt-3">
        <button
          type="submit"
          disabled={status === "loading" || !content.trim()}
          className="px-5 py-2 text-sm font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 transition-colors"
        >
          {status === "loading"
            ? "Posting..."
            : parentId
              ? "Reply"
              : "Post Comment"}
        </button>
      </div>
      {status === "error" && (
        <p className="text-sm text-red-500 mt-2">Failed to post. Try again.</p>
      )}
    </form>
  );
}
