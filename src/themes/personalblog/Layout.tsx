"use client";

import "./styles/theme.css";

export default function PersonalBlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: "var(--personalblog-bg)",
        color: "var(--personalblog-text)",
      }}
    >
      <style jsx global>{`
        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          font-family: var(--personalblog-font-heading);
        }
      `}</style>
      {children}
    </div>
  );
}
