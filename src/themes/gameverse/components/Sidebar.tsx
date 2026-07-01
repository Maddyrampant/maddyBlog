import Link from "next/link";

type SidebarProps = {
  categories?: Array<{ name: string; slug: string; _count: { posts: number } }>;
  popularTags?: Array<{ name: string; slug: string; postCount: number }>;
};

export default function GameverseSidebar({
  categories,
  popularTags,
}: SidebarProps) {
  return (
    <aside className="space-y-10">
      {categories && categories.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-5">
            <span
              className="inline-block w-2 h-2 rounded-full gameverse-pulse"
              style={{ backgroundColor: "var(--gameverse-neon-purple)" }}
            />
            <h3
              className="text-xs font-bold uppercase tracking-[0.15em]"
              style={{ color: "var(--gameverse-neon-purple)" }}
            >
              Categories
            </h3>
          </div>
          <div className="space-y-3">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="flex items-center justify-between text-sm py-2 px-3 rounded-lg transition-all font-semibold"
                style={{ color: "var(--gameverse-text-muted)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    "var(--gameverse-accent-light)";
                  e.currentTarget.style.color = "var(--gameverse-neon-purple)";
                  e.currentTarget.style.boxShadow =
                    "0 0 12px var(--gameverse-accent-glow)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--gameverse-text-muted)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <span>{cat.name}</span>
                <span className="text-xs font-mono">{cat._count.posts}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {popularTags && popularTags.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-5">
            <span
              className="inline-block w-2 h-2 rounded-full gameverse-pulse"
              style={{ backgroundColor: "var(--gameverse-neon-purple)" }}
            />
            <h3
              className="text-xs font-bold uppercase tracking-[0.15em]"
              style={{ color: "var(--gameverse-neon-purple)" }}
            >
              Popular Tags
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <Link
                key={tag.slug}
                href={`/tags/${tag.slug}`}
                className="text-xs px-3 py-1.5 rounded-full transition-all font-semibold"
                style={{
                  border: "1px solid var(--gameverse-border)",
                  color: "var(--gameverse-text-muted)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor =
                    "var(--gameverse-neon-purple)";
                  e.currentTarget.style.background =
                    "var(--gameverse-accent-light)";
                  e.currentTarget.style.color = "var(--gameverse-neon-purple)";
                  e.currentTarget.style.boxShadow =
                    "0 0 12px var(--gameverse-accent-glow)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--gameverse-border)";
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--gameverse-text-muted)";
                  e.currentTarget.style.boxShadow = "none";
                }}
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
