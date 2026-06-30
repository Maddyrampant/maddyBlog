import Link from "next/link";

type RelatedPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  createdAt: Date;
  author: { username: string };
};

type RelatedPostsProps = {
  posts: RelatedPost[];
  title?: string;
};

export default function ZoomgRelatedPosts({ posts, title = "مطالب مرتبط" }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-12 pt-10" style={{ borderTop: "1px solid var(--zoomg-border)" }}>
      <div className="zoomg-section-header">
        <h2 className="zoomg-section-title">{title}</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/posts/${post.slug}`}
            className="zoomg-card p-4 block group"
          >
            <h3
              className="font-semibold text-sm group-hover transition-colors line-clamp-2"
              style={{ color: "var(--zoomg-text-primary)" }}
            >
              {post.title}
            </h3>
            {post.excerpt && (
              <p
                className="text-xs mt-2 line-clamp-2 leading-relaxed"
                style={{ color: "var(--zoomg-text-muted)" }}
              >
                {post.excerpt}
              </p>
            )}
            <div
              className="flex items-center gap-2 mt-3 text-xs"
              style={{ color: "var(--zoomg-text-muted)" }}
            >
              <span className="font-medium" style={{ color: "var(--zoomg-text-primary)" }}>
                {post.author.username}
              </span>
              <span
                className="w-1 h-1 rounded-full inline-block"
                style={{ background: "var(--zoomg-text-muted)" }}
              />
              <time>
                {new Date(post.createdAt).toLocaleDateString("fa-IR")}
              </time>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
