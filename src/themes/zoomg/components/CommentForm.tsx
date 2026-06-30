"use client";

import { useState } from "react";

type CommentFormProps = {
  postId: string;
  parentId?: string;
  onSuccess?: () => void;
};

export default function ZoomgCommentForm({ postId, parentId, onSuccess }: CommentFormProps) {
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

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
      <p className="text-sm font-medium" style={{ color: "var(--zoomg-accent)" }}>
        دیدگاه شما با موفقیت ثبت شد!
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={parentId ? "پاسخ خود را بنویسید..." : "دیدگاه خود را بنویسید..."}
        rows={4}
        className="zoomg-input resize-none text-sm"
        required
      />
      <div className="flex items-center justify-between mt-3">
        <button
          type="submit"
          disabled={status === "loading" || !content.trim()}
          className="zoomg-btn zoomg-btn-primary text-sm"
        >
          {status === "loading" ? "در حال ارسال..." : parentId ? "پاسخ" : "ارسال دیدگاه"}
        </button>
      </div>
      {status === "error" && (
        <p className="text-sm mt-2" style={{ color: "#dc2626" }}>
          خطا در ارسال دیدگاه. دوباره تلاش کنید.
        </p>
      )}
    </form>
  );
}
