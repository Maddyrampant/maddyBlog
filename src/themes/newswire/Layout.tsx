"use client";

import "./styles/theme.css";

export default function NewsWireLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: "var(--newswire-bg)",
        color: "var(--newswire-text)",
      }}
    >
      {children}
    </div>
  );
}
