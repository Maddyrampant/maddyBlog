type ReadingTimeProps = {
  minutes: number;
};

export default function GameverseReadingTime({ minutes }: ReadingTimeProps) {
  return (
    <span
      className="font-mono text-xs"
      style={{ color: "var(--gameverse-text-muted)" }}
    >
      {minutes} min read
    </span>
  );
}
