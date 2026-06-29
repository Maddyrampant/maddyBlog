export default function MadelinLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: "var(--madelin-warm-bg)",
        color: "var(--madelin-text)",
      }}
    >
      {children}
    </div>
  );
}
