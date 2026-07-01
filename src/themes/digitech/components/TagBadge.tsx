import Link from "next/link";

type TagBadgeProps = {
  name: string;
  slug: string;
};

export default function DigitechTagBadge({ name, slug }: TagBadgeProps) {
  return (
    <Link
      href={`/tags/${slug}`}
      className="text-xs px-2.5 py-1 rounded-full transition-colors"
      style={{
        background: "var(--digitech-accent-glow)",
        color: "var(--digitech-accent)",
      }}
    >
      #{name}
    </Link>
  );
}
