"use client";

import { useState } from "react";

export default function PersonalBlogNewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

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
    <div className="personalblog-card p-6">
      <h3 className="personalblog-heading text-lg personalblog-gradient-text">
        Stay in touch
      </h3>
      <p
        className="text-sm mt-1 mb-5"
        style={{ color: "var(--personalblog-text-muted)" }}
      >
        Get the latest posts delivered to your inbox. No spam, ever.
      </p>

      {status === "success" ? (
        <p
          className="text-sm font-medium"
          style={{ color: "var(--personalblog-accent)" }}
        >
          Thanks for subscribing!
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="flex-1 px-3 py-2 text-sm rounded-lg transition-all"
            style={{
              border: "1px solid var(--personalblog-border)",
              background: "transparent",
              color: "var(--personalblog-text)",
            }}
            onFocus={(e) =>
              (e.currentTarget.style.borderColor = "var(--personalblog-accent)")
            }
            onBlur={(e) =>
              (e.currentTarget.style.borderColor = "var(--personalblog-border)")
            }
            required
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-4 py-2 text-sm font-medium rounded-lg transition-all disabled:opacity-50"
            style={{
              background: "var(--personalblog-accent)",
              color: "#fff",
            }}
          >
            {status === "loading" ? "..." : "Subscribe"}
          </button>
        </form>
      )}

      {status === "error" && (
        <p className="text-sm mt-2" style={{ color: "#dc2626" }}>
          Something went wrong. Try again.
        </p>
      )}
    </div>
  );
}
