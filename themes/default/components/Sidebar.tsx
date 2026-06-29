import Link from "next/link";

type SidebarProps = {
  categories?: Array<{ name: string; slug: string; _count: { posts: number } }>;
  popularTags?: Array<{ name: string; slug: string; postCount: number }>;
};

export default function DefaultSidebar({ categories, popularTags }: SidebarProps) {
  return (
    <aside className="space-y-8">
      {categories && categories.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">
            Categories
          </h3>
          <div className="space-y-2">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="flex items-center justify-between text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              >
                <span>{cat.name}</span>
                <span className="text-xs text-zinc-400">({cat._count.posts})</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {popularTags && popularTags.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">
            Popular Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <Link
                key={tag.slug}
                href={`/tags/${tag.slug}`}
                className="text-xs px-2.5 py-1 rounded-full border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
