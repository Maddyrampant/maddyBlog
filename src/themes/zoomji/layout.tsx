export default function ZoomjiLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: "var(--zoomji-bg)",
        color: "var(--zoomji-text)",
      }}
    >
      {children}
    </div>
  );
}
