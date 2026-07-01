import Link from "next/link";

type CategoryBadgeProps = {
  name: string;
  slug: string;
};

export default function NewsWireCategoryBadge({
  name,
  slug,
}: CategoryBadgeProps) {
  return (
    <Link
      href={`/categories/${slug}`}
      className="text-xs font-bold uppercase tracking-[0.15em] px-3 py-1 transition-colors"
      style={{
        color: "#fff",
        background: "var(--newswire-accent)",
      }}
    >
      {name}
    </Link>
  );
}
