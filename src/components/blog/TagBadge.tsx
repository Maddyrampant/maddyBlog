import Link from "next/link";

export default function TagBadge({ name, slug }: { name: string; slug: string }) {
  return (
    <Link
      href={`/tags/${slug}`}
      className="inline-block px-3 py-1 text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
    >
      #{name}
    </Link>
  );
}
