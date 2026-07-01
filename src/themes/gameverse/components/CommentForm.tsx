"use client";

import { useState } from "react";

type CommentFormProps = {
  postId: string;
  parentId?: string;
  onSuccess?: () => void;
};

export default function GameverseCommentForm({
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
        className="text-sm font-semibold"
        style={{ color: "var(--gameverse-neon-cyan)" }}
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
        placeholder={parentId ? "Write a reply..." : "Share your thoughts..."}
        rows={4}
        className="w-full px-4 py-3 text-sm rounded-lg transition-all resize-none font-mono"
        style={{
          border: "1px solid var(--gameverse-border)",
          background: "transparent",
          color: "var(--gameverse-text)",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "var(--gameverse-neon-purple)";
          e.currentTarget.style.boxShadow =
            "0 0 12px var(--gameverse-accent-glow)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "var(--gameverse-border)";
          e.currentTarget.style.boxShadow = "none";
        }}
        required
      />
      <div className="flex items-center justify-between mt-3">
        <button
          type="submit"
          disabled={status === "loading" || !content.trim()}
          className="px-5 py-2 text-sm font-bold rounded-lg transition-all disabled:opacity-50"
          style={{
            background:
              "linear-gradient(135deg, var(--gameverse-neon-purple), #7c3aed)",
            color: "#fff",
            boxShadow: "0 0 16px var(--gameverse-accent-glow)",
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
        <p className="text-sm mt-2" style={{ color: "#ef4444" }}>
          Failed to post. Try again.
        </p>
      )}
    </form>
  );
}
