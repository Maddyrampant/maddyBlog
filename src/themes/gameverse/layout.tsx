"use client";

import "../gameverse/styles/theme.css";

export default function GameverseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: "var(--gameverse-bg)",
        color: "var(--gameverse-text)",
        fontFamily: "var(--gameverse-font)",
      }}
    >
      {children}
    </div>
  );
}
