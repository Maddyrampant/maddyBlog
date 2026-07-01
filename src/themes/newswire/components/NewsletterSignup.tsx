"use client";

import { useState } from "react";

export default function NewsWireNewsletterSignup() {
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
    <div
      className="newswire-card p-6"
      style={{ borderLeft: "3px solid var(--newswire-accent-blue)" }}
    >
      <h3 className="font-black text-lg newswire-headline">Stay Informed</h3>
      <p
        className="text-sm mt-1 mb-5"
        style={{ color: "var(--newswire-text-muted)" }}
      >
        Get the latest headlines delivered to your inbox. No spam, ever.
      </p>

      {status === "success" ? (
        <p
          className="text-sm font-bold"
          style={{ color: "var(--newswire-accent)" }}
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
            className="flex-1 px-3 py-2 text-sm transition-all"
            style={{
              border: "1px solid var(--newswire-border)",
              background: "transparent",
              color: "var(--newswire-text)",
            }}
            onFocus={(e) =>
              (e.currentTarget.style.borderColor =
                "var(--newswire-accent-blue)")
            }
            onBlur={(e) =>
              (e.currentTarget.style.borderColor = "var(--newswire-border)")
            }
            required
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-4 py-2 text-sm font-bold transition-all disabled:opacity-50"
            style={{
              background: "var(--newswire-accent)",
              color: "#fff",
            }}
          >
            {status === "loading" ? "..." : "Subscribe"}
          </button>
        </form>
      )}

      {status === "error" && (
        <p className="text-sm mt-2" style={{ color: "var(--newswire-accent)" }}>
          Something went wrong. Try again.
        </p>
      )}
    </div>
  );
}
