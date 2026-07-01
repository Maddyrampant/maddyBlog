"use client";

import { useState } from "react";

type CommentFormProps = {
  postId: string;
  parentId?: string;
  onSuccess?: () => void;
};

export default function NewsWireCommentForm({
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
      <p
        className="text-sm font-bold"
        style={{ color: "var(--newswire-accent)" }}
      >
        Comment posted successfully!
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={parentId ? "Write a reply..." : "Join the discussion..."}
        rows={4}
        className="w-full px-4 py-3 text-sm transition-all resize-none"
        style={{
          border: "1px solid var(--newswire-border)",
          background: "transparent",
          color: "var(--newswire-text)",
        }}
        onFocus={(e) =>
          (e.currentTarget.style.borderColor = "var(--newswire-accent-blue)")
        }
        onBlur={(e) =>
          (e.currentTarget.style.borderColor = "var(--newswire-border)")
        }
        required
      />
      <div className="flex items-center justify-between mt-3">
        <button
          type="submit"
          disabled={status === "loading" || !content.trim()}
          className="px-5 py-2 text-sm font-bold transition-all disabled:opacity-50"
          style={{
            background: "var(--newswire-accent)",
            color: "#fff",
          }}
        >
          {status === "loading"
            ? "Posting..."
            : parentId
              ? "Reply"
              : "Post Comment"}
        </button>
      </div>
      {status === "error" && (
        <p className="text-sm mt-2" style={{ color: "var(--newswire-accent)" }}>
          Failed to post. Try again.
        </p>
      )}
    </form>
  );
}
