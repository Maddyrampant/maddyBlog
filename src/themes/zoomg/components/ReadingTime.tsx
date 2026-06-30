type ReadingTimeProps = {
  minutes: number;
};

export default function ZoomgReadingTime({ minutes }: ReadingTimeProps) {
  return (
    <span style={{ color: "var(--zoomg-text-muted)" }}>
      زمان مطالعه: {minutes} دقیقه
    </span>
  );
}
