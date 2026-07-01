type ReadingTimeProps = {
  minutes: number;
};

export default function PersonalBlogReadingTime({ minutes }: ReadingTimeProps) {
  return (
    <span style={{ color: "var(--personalblog-text-muted)" }}>
      {minutes} min read
    </span>
  );
}
