"use client";

import { useState } from "react";
import type { BuilderElement } from "@/lib/header-footer/types";

type NewsletterElementProps = {
  element: BuilderElement;
  themeName: string;
};

export default function NewsletterElement({
  themeName,
}: NewsletterElementProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) return;
    setStatus("success");
    setEmail("");
    setTimeout(() => setStatus("idle"), 3000);
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email..."
        required
        className="px-3 py-1.5 text-sm border rounded-md outline-none flex-1 min-w-0"
        style={{
          backgroundColor: `var(--${themeName}-bg, #ffffff)`,
          borderColor: `var(--${themeName}-border, #e4e4e7)`,
          color: `var(--${themeName}-text)`,
        }}
      />
      <button
        type="submit"
        className="px-3 py-1.5 text-sm font-medium rounded-md hover:opacity-90 transition-opacity"
        style={{
          backgroundColor: `var(--${themeName}-accent, #3b82f6)`,
          color: "#ffffff",
        }}
      >
        {status === "success" ? "Subscribed!" : "Subscribe"}
      </button>
    </form>
  );
}
