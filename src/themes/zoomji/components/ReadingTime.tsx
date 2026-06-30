type ReadingTimeProps = {
  minutes: number;
};

export default function ZoomjiReadingTime({ minutes }: ReadingTimeProps) {
  return (
    <span style={{ color: "var(--zoomji-text-muted)" }}>
      {minutes} min read
    </span>
  );
}
