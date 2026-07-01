import Link from "next/link";

type SidebarProps = {
  categories?: Array<{ name: string; slug: string; _count: { posts: number } }>;
  popularTags?: Array<{ name: string; slug: string; postCount: number }>;
};

export default function PersonalBlogSidebar({
  categories,
  popularTags,
}: SidebarProps) {
  return (
    <aside className="space-y-10">
      {categories && categories.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-5">
            <span
              className="w-6 h-px"
              style={{ background: "var(--personalblog-accent)" }}
            />
            <h3
              className="text-xs font-semibold uppercase tracking-[0.15em]"
              style={{ color: "var(--personalblog-accent)" }}
            >
              Categories
            </h3>
          </div>
          <div className="space-y-3">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="flex items-center justify-between text-sm py-2 px-3 rounded-lg transition-all"
                style={{ color: "var(--personalblog-text-muted)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    "var(--personalblog-accent-light)";
                  e.currentTarget.style.color = "var(--personalblog-accent)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color =
                    "var(--personalblog-text-muted)";
                }}
              >
                <span>{cat.name}</span>
                <span className="text-xs">{cat._count.posts}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {popularTags && popularTags.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-5">
            <span
              className="w-6 h-px"
              style={{ background: "var(--personalblog-accent)" }}
            />
            <h3
              className="text-xs font-semibold uppercase tracking-[0.15em]"
              style={{ color: "var(--personalblog-accent)" }}
            >
              Popular Tags
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <Link
                key={tag.slug}
                href={`/tags/${tag.slug}`}
                className="text-xs px-3 py-1.5 rounded-full transition-all"
                style={{
                  border: "1px solid var(--personalblog-border)",
                  color: "var(--personalblog-text-muted)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor =
                    "var(--personalblog-accent)";
                  e.currentTarget.style.background =
                    "var(--personalblog-accent-light)";
                  e.currentTarget.style.color = "var(--personalblog-accent)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor =
                    "var(--personalblog-border)";
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color =
                    "var(--personalblog-text-muted)";
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
