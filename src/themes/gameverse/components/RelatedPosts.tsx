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

export default function GameverseRelatedPosts({
  posts,
  title = "Related Posts",
}: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section
      className="mt-20 pt-12"
      style={{ borderTop: "1px solid var(--gameverse-border)" }}
    >
      <div className="flex items-center gap-3 mb-6">
        <span
          className="inline-block w-2 h-2 rounded-full gameverse-pulse"
          style={{ backgroundColor: "var(--gameverse-neon-purple)" }}
        />
        <h2 className="text-2xl font-bold gameverse-gradient-text">{title}</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/posts/${post.slug}`}
            className="gameverse-card p-5 block group"
          >
            <h3
              className="font-bold group-hover transition-colors"
              style={{ color: "var(--gameverse-text)" }}
            >
              {post.title}
            </h3>
            {post.excerpt && (
              <p
                className="text-sm mt-2 line-clamp-2"
                style={{ color: "var(--gameverse-text-muted)" }}
              >
                {post.excerpt}
              </p>
            )}
            <div
              className="flex items-center gap-2 mt-3 text-xs font-mono"
              style={{ color: "var(--gameverse-text-muted)" }}
            >
              <span
                className="font-semibold"
                style={{ color: "var(--gameverse-text)" }}
              >
                {post.author.username}
              </span>
              <span
                className="w-1 h-1 rounded-full"
                style={{ background: "var(--gameverse-text-muted)" }}
              />
              <time>{new Date(post.createdAt).toLocaleDateString()}</time>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
