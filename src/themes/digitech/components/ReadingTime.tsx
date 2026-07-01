type ReadingTimeProps = {
  minutes: number;
};

export default function DigitechReadingTime({ minutes }: ReadingTimeProps) {
  return (
    <span style={{ color: "var(--digitech-text-muted)" }}>
      {minutes} min read
    </span>
  );
}
