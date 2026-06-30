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

export default function ZoomjiRelatedPosts({ posts, title = "Related Posts" }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-20 pt-12" style={{ borderTop: "1px solid var(--zoomji-border)" }}>
      <div className="zoomji-section-title mb-6">
        <span>{title}</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/posts/${post.slug}`}
            className="zoomji-card p-5 block group"
          >
            <h3
              className="font-semibold text-sm group-hover transition-colors line-clamp-2"
              style={{ color: "var(--zoomji-text)" }}
            >
              {post.title}
            </h3>
            {post.excerpt && (
              <p className="text-xs mt-2 line-clamp-2" style={{ color: "var(--zoomji-text-muted)" }}>
                {post.excerpt}
              </p>
            )}
            <div className="flex items-center gap-2 mt-3 text-xs" style={{ color: "var(--zoomji-text-muted)" }}>
              <span className="font-medium" style={{ color: "var(--zoomji-text)" }}>
                {post.author.username}
              </span>
              <span className="w-1 h-1 rounded-full" style={{ background: "var(--zoomji-text-muted)" }} />
              <time>{new Date(post.createdAt).toLocaleDateString()}</time>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
