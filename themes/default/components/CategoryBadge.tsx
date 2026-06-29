import Link from "next/link";

type CategoryBadgeProps = {
  name: string;
  slug: string;
};

export default function DefaultCategoryBadge({ name, slug }: CategoryBadgeProps) {
  return (
    <Link
      href={`/categories/${slug}`}
      className="text-xs font-semibold uppercase tracking-widest text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
    >
      {name}
    </Link>
  );
}
