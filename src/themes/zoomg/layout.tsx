export default function ZoomgLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex flex-col"
      dir="rtl"
      style={{
        backgroundColor: "var(--zoomg-bg-primary)",
        color: "var(--zoomg-text-primary)",
        fontFamily: "var(--zoomg-font-family, IRANSansX, system-ui, sans-serif)",
      }}
    >
      {children}
    </div>
  );
}
