"use client";

import "./styles/theme.css";

export default function EduProLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: "var(--edupro-bg)",
        color: "var(--edupro-text)",
      }}
    >
      {children}
    </div>
  );
}
