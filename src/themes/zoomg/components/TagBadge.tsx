import Link from "next/link";

type TagBadgeProps = {
  name: string;
  slug: string;
};

export default function ZoomgTagBadge({ name, slug }: TagBadgeProps) {
  return (
    <Link
      href={`/tags/${slug}`}
      className="text-xs px-2.5 py-1 rounded-full transition-colors"
      style={{
        border: "1px solid var(--zoomg-border)",
        color: "var(--zoomg-text-muted)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--zoomg-accent)";
        e.currentTarget.style.color = "var(--zoomg-accent)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--zoomg-border)";
        e.currentTarget.style.color = "var(--zoomg-text-muted)";
      }}
    >
      {name}
    </Link>
  );
}
