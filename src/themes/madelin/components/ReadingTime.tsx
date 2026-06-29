type ReadingTimeProps = {
  minutes: number;
};

export default function MadelinReadingTime({ minutes }: ReadingTimeProps) {
  return (
    <span style={{ color: "var(--madelin-text-muted)" }}>
      {minutes} min read
    </span>
  );
}
