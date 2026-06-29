import Link from "next/link";

type TagBadgeProps = {
  name: string;
  slug: string;
};

export default function DefaultTagBadge({ name, slug }: TagBadgeProps) {
  return (
    <Link
      href={`/tags/${slug}`}
      className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
    >
      #{name}
    </Link>
  );
}
