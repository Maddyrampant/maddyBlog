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

export default function NewsWireRelatedPosts({
  posts,
  title = "Related Stories",
}: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section
      className="mt-16 pt-10"
      style={{ borderTop: "2px solid var(--newswire-accent)" }}
    >
      <div className="flex items-center gap-3 mb-6">
        <span
          className="w-10 h-0.5"
          style={{ background: "var(--newswire-accent)" }}
        />
        <h2 className="text-xl font-black newswire-headline">{title}</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/posts/${post.slug}`}
            className="newswire-card p-5 block group"
          >
            <h3
              className="font-bold group-hover newswire-headline"
              style={{ color: "var(--newswire-text)" }}
            >
              {post.title}
            </h3>
            {post.excerpt && (
              <p
                className="text-sm mt-2 line-clamp-2"
                style={{ color: "var(--newswire-text-muted)" }}
              >
                {post.excerpt}
              </p>
            )}
            <div
              className="flex items-center gap-2 mt-3 text-xs"
              style={{ color: "var(--newswire-text-muted)" }}
            >
              <span
                className="font-semibold"
                style={{ color: "var(--newswire-text)" }}
              >
                {post.author.username}
              </span>
              <span
                className="w-1 h-1 rounded-full"
                style={{ background: "var(--newswire-text-muted)" }}
              />
              <time>{new Date(post.createdAt).toLocaleDateString()}</time>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
