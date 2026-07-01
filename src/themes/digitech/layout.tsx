import "./styles/theme.css";

export default function DigitechLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: "var(--digitech-bg)",
        color: "var(--digitech-text)",
      }}
    >
      {children}
    </div>
  );
}
