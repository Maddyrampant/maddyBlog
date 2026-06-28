import Link from "next/link";

export default function CategoryBadge({ name, slug }: { name: string; slug: string }) {
  return (
    <Link
      href={`/categories/${slug}`}
      className="inline-block px-3 py-1 text-xs font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 rounded-full hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
    >
      {name}
    </Link>
  );
}
