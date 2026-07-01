import Link from "next/link";

type CategoryBadgeProps = {
  name: string;
  slug: string;
};

export default function GameverseCategoryBadge({
  name,
  slug,
}: CategoryBadgeProps) {
  return (
    <Link
      href={`/categories/${slug}`}
      className="text-xs font-bold uppercase tracking-[0.1em] transition-colors px-3 py-1 rounded-full"
      style={{
        background: "var(--gameverse-accent-light)",
        color: "var(--gameverse-neon-purple)",
        border: "1px solid var(--gameverse-border)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--gameverse-neon-purple)";
        e.currentTarget.style.boxShadow =
          "0 0 12px var(--gameverse-accent-glow)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--gameverse-border)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {name}
    </Link>
  );
}
