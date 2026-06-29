import Link from "next/link";

type TagBadgeProps = {
  name: string;
  slug: string;
};

export default function MadelinTagBadge({ name, slug }: TagBadgeProps) {
  return (
    <Link
      href={`/tags/${slug}`}
      className="text-xs px-2.5 py-1 rounded-full transition-colors"
      style={{
        background: "var(--madelin-accent-light)",
        color: "var(--madelin-accent)",
      }}
    >
      #{name}
    </Link>
  );
}
