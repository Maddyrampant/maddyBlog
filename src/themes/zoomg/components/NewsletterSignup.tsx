"use client";

import { useState } from "react";

export default function ZoomgNewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Failed to subscribe");
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="zoomg-card p-5">
      <h3 className="font-bold text-base zoomg-gradient-text mb-1">
        عضویت در خبرنامه
      </h3>
      <p
        className="text-sm mb-4 leading-relaxed"
        style={{ color: "var(--zoomg-text-muted)" }}
      >
        آخرین مطالب را در ایمیل خود دریافت کنید. بدون اسپم.
      </p>

      {status === "success" ? (
        <p className="text-sm font-medium" style={{ color: "var(--zoomg-accent)" }}>
          با تشکر! ایمیل شما با موفقیت ثبت شد.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ایمیل خود را وارد کنید"
            className="zoomg-input text-sm"
            required
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="zoomg-btn zoomg-btn-primary text-sm py-2 justify-center"
          >
            {status === "loading" ? "..." : "عضویت"}
          </button>
        </form>
      )}

      {status === "error" && (
        <p className="text-sm mt-2" style={{ color: "#dc2626" }}>
          خطایی رخ داد. دوباره تلاش کنید.
        </p>
      )}
    </div>
  );
}
