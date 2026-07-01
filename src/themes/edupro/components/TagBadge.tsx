import Link from "next/link";

type TagBadgeProps = {
  name: string;
  slug: string;
};

export default function EduProTagBadge({ name, slug }: TagBadgeProps) {
  return (
    <Link
      href={`/tags/${slug}`}
      className="text-xs px-2.5 py-1 rounded-full transition-colors"
      style={{
        background: "var(--edupro-accent-light)",
        color: "var(--edupro-accent)",
      }}
    >
      {name}
    </Link>
  );
}
