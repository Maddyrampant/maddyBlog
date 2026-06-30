import Link from "next/link";

type CategoryBadgeProps = {
  name: string;
  slug: string;
};

export default function ZoomjiCategoryBadge({ name, slug }: CategoryBadgeProps) {
  return (
    <Link
      href={`/categories/${slug}`}
      className="text-xs font-semibold uppercase tracking-[0.15em] transition-colors"
      style={{ color: "var(--zoomji-accent)" }}
    >
      {name}
    </Link>
  );
}
