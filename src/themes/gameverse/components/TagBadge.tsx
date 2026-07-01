import Link from "next/link";

type TagBadgeProps = {
  name: string;
  slug: string;
};

export default function GameverseTagBadge({ name, slug }: TagBadgeProps) {
  return (
    <Link
      href={`/tags/${slug}`}
      className="text-xs px-2.5 py-1 rounded-full font-semibold transition-all"
      style={{
        background: "var(--gameverse-accent-light)",
        color: "var(--gameverse-neon-purple)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow =
          "0 0 12px var(--gameverse-accent-glow)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      #{name}
    </Link>
  );
}
