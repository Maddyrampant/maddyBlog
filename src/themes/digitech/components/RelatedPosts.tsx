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

export default function DigitechRelatedPosts({
  posts,
  title = "Related Posts",
}: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section
      className="mt-20 pt-12"
      style={{ borderTop: "1px solid var(--digitech-border)" }}
    >
      <div className="flex items-center gap-3 mb-8">
        <span
          className="w-8 h-px"
          style={{ background: "var(--digitech-accent)" }}
        />
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/posts/${post.slug}`}
            className="digitech-card p-5 block group"
          >
            <h3
              className="font-semibold transition-colors group-hover"
              style={{ color: "var(--digitech-text)" }}
            >
              {post.title}
            </h3>
            {post.excerpt && (
              <p
                className="text-sm mt-2 line-clamp-2"
                style={{ color: "var(--digitech-text-muted)" }}
              >
                {post.excerpt}
              </p>
            )}
            <div
              className="flex items-center gap-2 mt-3 text-xs"
              style={{ color: "var(--digitech-text-muted)" }}
            >
              <span
                className="font-medium"
                style={{ color: "var(--digitech-text)" }}
              >
                {post.author.username}
              </span>
              <span
                className="w-1 h-1 rounded-full"
                style={{ background: "var(--digitech-text-muted)" }}
              />
              <time>{new Date(post.createdAt).toLocaleDateString()}</time>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
