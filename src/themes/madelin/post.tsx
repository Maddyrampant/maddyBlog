import Link from "next/link";
import Image from "next/image";
import "../madelin/styles/theme.css";

type PostPageProps = {
  post: {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string | null;
    coverImage: string | null;
    createdAt: Date;
    updatedAt: Date;
    readingTime?: number;
    author: { username: string };
    category: { name: string; slug: string } | null;
    tags: { name: string; slug: string }[];
    _count: { comments: number };
  };
  commentTree?: Array<{
    id: string;
    content: string;
    createdAt: Date;
    author: { username: string };
    replies: Array<{
      id: string;
      content: string;
      createdAt: Date;
      author: { username: string };
    }>;
  }>;
  commentCount?: number;
};

export default function MadelinPostPage({
  post,
  commentTree,
  commentCount,
}: PostPageProps) {
  return (
    <main className="flex-1 mx-auto max-w-4xl w-full px-4 sm:px-6 py-12">
      <article>
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span
              className="w-8 h-px"
              style={{ background: "var(--madelin-accent)" }}
            />
            {post.category && (
              <Link
                href={`/categories/${post.category.slug}`}
                className="text-xs font-semibold uppercase tracking-[0.15em] transition-colors"
                style={{ color: "var(--madelin-accent)" }}
              >
                {post.category.name}
              </Link>
            )}
            {post.tags.map((tag) => (
              <Link
                key={tag.slug}
                href={`/tags/${tag.slug}`}
                className="text-xs px-2.5 py-1 rounded-full transition-colors"
                style={{
                  background: "var(--madelin-accent-light)",
                  color: "var(--madelin-accent)",
                }}
              >
                #{tag.name}
              </Link>
            ))}
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight mb-6">
            {post.title}
          </h1>

          <div
            className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm pb-8"
            style={{
              color: "var(--madelin-text-muted)",
              borderBottom: "1px solid var(--madelin-border)",
            }}
          >
            <span
              className="font-medium"
              style={{ color: "var(--madelin-text)" }}
            >
              {post.author.username}
            </span>
            <span
              className="w-1 h-1 rounded-full"
              style={{ background: "var(--madelin-text-muted)" }}
            />
            <time dateTime={post.createdAt.toISOString()}>
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </time>
            {post.readingTime && (
              <>
                <span
                  className="w-1 h-1 rounded-full"
                  style={{ background: "var(--madelin-text-muted)" }}
                />
                <span>{post.readingTime} min read</span>
              </>
            )}
            {post._count.comments > 0 && (
              <>
                <span
                  className="w-1 h-1 rounded-full"
                  style={{ background: "var(--madelin-text-muted)" }}
                />
                <span>{post._count.comments} comments</span>
              </>
            )}
          </div>
        </header>

        {post.coverImage && (
          <div className="aspect-[2/1] overflow-hidden rounded-2xl mb-12 relative madelin-glass">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 896px"
              priority
            />
          </div>
        )}

        <div
          className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:transition-colors prose-img:rounded-xl prose-blockquote:border-l-[3px] prose-blockquote:not-italic"
          style={
            {
              "--tw-prose-body": "var(--madelin-text)",
              "--tw-prose-headings": "var(--madelin-text)",
              "--tw-prose-links": "var(--madelin-accent)",
              "--tw-prose-bold": "var(--madelin-text)",
              "--tw-prose-quotes": "var(--madelin-text)",
              "--tw-prose-quote-borders": "var(--madelin-accent)",
              "--tw-prose-code": "var(--madelin-text)",
              "--tw-prose-pre-bg": "var(--madelin-warm-subtle)",
              "--tw-prose-hr": "var(--madelin-border)",
              "--tw-prose-th-borders": "var(--madelin-border)",
              color: "var(--madelin-text)",
            } as React.CSSProperties
          }
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      <section
        className="mt-20 pt-12"
        style={{ borderTop: "1px solid var(--madelin-border)" }}
      >
        <h2 className="text-2xl font-bold mb-2">
          Comments ({commentCount ?? post._count.comments})
        </h2>
        <p
          className="text-sm mb-8"
          style={{ color: "var(--madelin-text-muted)" }}
        >
          Share your thoughts about this post.
        </p>

        {commentTree && commentTree.length > 0 ? (
          <div className="space-y-6">
            {commentTree.map((comment) => (
              <div key={comment.id} className="madelin-card p-5">
                <div
                  className="flex items-center gap-2 text-sm mb-2"
                  style={{ color: "var(--madelin-text-muted)" }}
                >
                  <span
                    className="font-medium"
                    style={{ color: "var(--madelin-text)" }}
                  >
                    {comment.author.username}
                  </span>
                  <span
                    className="w-1 h-1 rounded-full"
                    style={{ background: "var(--madelin-text-muted)" }}
                  />
                  <time>
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </time>
                </div>
                <p>{comment.content}</p>
                {comment.replies.length > 0 && (
                  <div
                    className="mt-4 ml-6 space-y-4 pl-4"
                    style={{ borderLeft: "1px solid var(--madelin-border)" }}
                  >
                    {comment.replies.map((reply) => (
                      <div key={reply.id}>
                        <div
                          className="flex items-center gap-2 text-sm mb-1"
                          style={{ color: "var(--madelin-text-muted)" }}
                        >
                          <span
                            className="font-medium"
                            style={{ color: "var(--madelin-text)" }}
                          >
                            {reply.author.username}
                          </span>
                          <span
                            className="w-1 h-1 rounded-full"
                            style={{ background: "var(--madelin-text-muted)" }}
                          />
                          <time>
                            {new Date(reply.createdAt).toLocaleDateString()}
                          </time>
                        </div>
                        <p>{reply.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: "var(--madelin-text-muted)" }}>
            No comments yet. Be the first to share your thoughts!
          </p>
        )}
      </section>

      <hr className="madelin-divider mt-12" />
    </main>
  );
}
