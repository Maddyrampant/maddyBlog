import Link from "next/link";

type SidebarProps = {
  categories?: Array<{ name: string; slug: string; _count: { posts: number } }>;
  popularTags?: Array<{ name: string; slug: string; postCount: number }>;
};

export default function ZoomjiSidebar({ categories, popularTags }: SidebarProps) {
  return (
    <aside className="space-y-10">
      {categories && categories.length > 0 && (
        <div>
          <div className="zoomji-section-title mb-5">
            <span>Categories</span>
          </div>
          <div className="space-y-2">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="flex items-center justify-between text-sm py-2 px-3 rounded-lg transition-all"
                style={{ color: "var(--zoomji-text-muted)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--zoomji-accent-light)";
                  e.currentTarget.style.color = "var(--zoomji-accent)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--zoomji-text-muted)";
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
          <div className="zoomji-section-title mb-5">
            <span>Popular Tags</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <Link
                key={tag.slug}
                href={`/tags/${tag.slug}`}
                className="text-xs px-3 py-1.5 rounded-full transition-all"
                style={{ border: "1px solid var(--zoomji-border)", color: "var(--zoomji-text-muted)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--zoomji-accent)";
                  e.currentTarget.style.background = "var(--zoomji-accent-light)";
                  e.currentTarget.style.color = "var(--zoomji-accent)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--zoomji-border)";
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--zoomji-text-muted)";
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
