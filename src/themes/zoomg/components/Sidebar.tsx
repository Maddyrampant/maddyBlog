import Link from "next/link";

type SidebarProps = {
  categories?: Array<{ name: string; slug: string; _count: { posts: number } }>;
  popularTags?: Array<{ name: string; slug: string; postCount: number }>;
};

export default function ZoomgSidebar({ categories, popularTags }: SidebarProps) {
  return (
    <aside className="space-y-8">
      {categories && categories.length > 0 && (
        <div>
          <div className="zoomg-section-header">
            <h3 className="zoomg-section-title" style={{ fontSize: "0.9rem" }}>
              دسته‌بندی‌ها
            </h3>
          </div>
          <div className="space-y-1">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="flex items-center justify-between text-sm py-2 px-3 rounded-lg transition-all"
                style={{ color: "var(--zoomg-text-muted)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--zoomg-accent-light)";
                  e.currentTarget.style.color = "var(--zoomg-accent)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--zoomg-text-muted)";
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
          <div className="zoomg-section-header">
            <h3 className="zoomg-section-title" style={{ fontSize: "0.9rem" }}>
              برچسب‌های محبوب
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <Link
                key={tag.slug}
                href={`/tags/${tag.slug}`}
                className="text-xs px-3 py-1.5 rounded-full transition-all"
                style={{
                  border: "1px solid var(--zoomg-border)",
                  color: "var(--zoomg-text-muted)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--zoomg-accent)";
                  e.currentTarget.style.background = "var(--zoomg-accent-light)";
                  e.currentTarget.style.color = "var(--zoomg-accent)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--zoomg-border)";
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--zoomg-text-muted)";
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
