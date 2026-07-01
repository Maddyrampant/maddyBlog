import Link from "next/link";

type TagBadgeProps = {
  name: string;
  slug: string;
};

export default function PersonalBlogTagBadge({ name, slug }: TagBadgeProps) {
  return (
    <Link
      href={`/tags/${slug}`}
      className="text-xs px-2.5 py-1 rounded-full transition-colors"
      style={{
        background: "var(--personalblog-accent-light)",
        color: "var(--personalblog-accent)",
      }}
    >
      #{name}
    </Link>
  );
}
