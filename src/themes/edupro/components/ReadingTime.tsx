type ReadingTimeProps = {
  minutes: number;
};

export default function EduProReadingTime({ minutes }: ReadingTimeProps) {
  return (
    <span
      className="flex items-center gap-1.5"
      style={{ color: "var(--edupro-text-muted)" }}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
      </svg>
      {minutes} min read
    </span>
  );
}
