"use client";

import { useState } from "react";

export default function GameverseNewsletterSignup() {
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
    <div className="gameverse-card p-6">
      <h3 className="font-black text-lg gameverse-gradient-text">
        Stay in the game
      </h3>
      <p
        className="text-sm mt-1 mb-5"
        style={{ color: "var(--gameverse-text-muted)" }}
      >
        Get the latest gaming posts delivered to your inbox. No spam, ever.
      </p>

      {status === "success" ? (
        <p
          className="text-sm font-semibold"
          style={{ color: "var(--gameverse-neon-cyan)" }}
        >
          Thanks for subscribing, gamer!
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="flex-1 px-3 py-2 text-sm rounded-lg transition-all font-mono"
            style={{
              border: "1px solid var(--gameverse-border)",
              background: "transparent",
              color: "var(--gameverse-text)",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor =
                "var(--gameverse-neon-purple)";
              e.currentTarget.style.boxShadow =
                "0 0 12px var(--gameverse-accent-glow)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "var(--gameverse-border)";
              e.currentTarget.style.boxShadow = "none";
            }}
            required
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-4 py-2 text-sm font-bold rounded-lg transition-all disabled:opacity-50"
            style={{
              background:
                "linear-gradient(135deg, var(--gameverse-neon-purple), #7c3aed)",
              color: "#fff",
              boxShadow: "0 0 16px var(--gameverse-accent-glow)",
            }}
          >
            {status === "loading" ? "..." : "Subscribe"}
          </button>
        </form>
      )}

      {status === "error" && (
        <p className="text-sm mt-2" style={{ color: "#ef4444" }}>
          Something went wrong. Try again.
        </p>
      )}
    </div>
  );
}
