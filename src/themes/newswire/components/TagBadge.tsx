import Link from "next/link";

type TagBadgeProps = {
  name: string;
  slug: string;
};

export default function NewsWireTagBadge({ name, slug }: TagBadgeProps) {
  return (
    <Link
      href={`/tags/${slug}`}
      className="text-xs px-2.5 py-1 rounded transition-colors"
      style={{
        border: "1px solid var(--newswire-border)",
        color: "var(--newswire-text-muted)",
      }}
    >
      {name}
    </Link>
  );
}
