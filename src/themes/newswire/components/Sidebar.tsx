import Link from "next/link";

type SidebarProps = {
  categories?: Array<{ name: string; slug: string; _count: { posts: number } }>;
  popularTags?: Array<{ name: string; slug: string; postCount: number }>;
};

export default function NewsWireSidebar({
  categories,
  popularTags,
}: SidebarProps) {
  return (
    <aside className="space-y-8">
      {categories && categories.length > 0 && (
        <div>
          <h3
            className="text-xs font-bold uppercase tracking-[0.15em] mb-4 pb-2"
            style={{
              color: "var(--newswire-accent)",
              borderBottom: "2px solid var(--newswire-accent)",
            }}
          >
            Sections
          </h3>
          <div className="space-y-1">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="flex items-center justify-between text-sm py-2 px-3 transition-all"
                style={{ color: "var(--newswire-text-muted)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--newswire-card-bg)";
                  e.currentTarget.style.color = "var(--newswire-accent)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--newswire-text-muted)";
                }}
              >
                <span className="font-medium">{cat.name}</span>
                <span className="text-xs font-bold">{cat._count.posts}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {popularTags && popularTags.length > 0 && (
        <div>
          <h3
            className="text-xs font-bold uppercase tracking-[0.15em] mb-4 pb-2"
            style={{
              color: "var(--newswire-accent)",
              borderBottom: "2px solid var(--newswire-accent)",
            }}
          >
            Trending Topics
          </h3>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <Link
                key={tag.slug}
                href={`/tags/${tag.slug}`}
                className="text-xs px-3 py-1.5 font-medium transition-all"
                style={{
                  border: "1px solid var(--newswire-border)",
                  color: "var(--newswire-text-muted)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor =
                    "var(--newswire-accent-blue)";
                  e.currentTarget.style.color = "var(--newswire-accent-blue)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--newswire-border)";
                  e.currentTarget.style.color = "var(--newswire-text-muted)";
                }}
              >
                {tag.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
