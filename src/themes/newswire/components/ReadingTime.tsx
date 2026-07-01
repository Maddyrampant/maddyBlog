type ReadingTimeProps = {
  minutes: number;
};

export default function NewsWireReadingTime({ minutes }: ReadingTimeProps) {
  return (
    <span style={{ color: "var(--newswire-text-muted)" }}>
      {minutes} min read
    </span>
  );
}
