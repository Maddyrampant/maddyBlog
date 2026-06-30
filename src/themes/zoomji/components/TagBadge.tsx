import Link from "next/link";

type TagBadgeProps = {
  name: string;
  slug: string;
};

export default function ZoomjiTagBadge({ name, slug }: TagBadgeProps) {
  return (
    <Link
      href={`/tags/${slug}`}
      className="text-xs px-2.5 py-1 rounded-full transition-colors"
      style={{ background: "var(--zoomji-accent-light)", color: "var(--zoomji-accent)" }}
    >
      #{name}
    </Link>
  );
}
