import Link from "next/link";

type CategoryBadgeProps = {
  name: string;
  slug: string;
};

export default function ZoomgCategoryBadge({ name, slug }: CategoryBadgeProps) {
  return (
    <Link
      href={`/categories/${slug}`}
      className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full transition-colors"
      style={{
        background: "var(--zoomg-accent-light)",
        color: "var(--zoomg-accent)",
      }}
    >
      {name}
    </Link>
  );
}
