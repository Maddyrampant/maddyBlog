import Link from "next/link";
import Image from "next/image";
import "../gameverse/styles/theme.css";
import { ReactionsBar } from "@/components/social/ReactionsBar";

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

export default function GameversePostPage({
  post,
  commentTree,
  commentCount,
}: PostPageProps) {
  return (
    <main className="flex-1 mx-auto max-w-4xl w-full px-4 sm:px-6 py-12">
      <article>
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            {post.category && (
              <Link
                href={`/categories/${post.category.slug}`}
                className="text-xs font-bold uppercase tracking-[0.15em] transition-colors"
                style={{ color: "var(--gameverse-neon-purple)" }}
              >
                {post.category.name}
              </Link>
            )}
            {post.tags.map((tag) => (
              <Link
                key={tag.slug}
                href={`/tags/${tag.slug}`}
                className="text-xs px-2.5 py-1 rounded-full font-semibold transition-colors"
                style={{
                  background: "var(--gameverse-accent-light)",
                  color: "var(--gameverse-neon-purple)",
                }}
              >
                #{tag.name}
              </Link>
            ))}
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight mb-6 gameverse-gradient-text">
            {post.title}
          </h1>

          <div
            className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm pb-8"
            style={{
              color: "var(--gameverse-text-muted)",
              borderBottom: "1px solid var(--gameverse-border)",
            }}
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
                  style={{ background: "var(--gameverse-text-muted)" }}
                />
                <span>{post.readingTime} min read</span>
              </>
            )}
            {post._count.comments > 0 && (
              <>
                <span
                  className="w-1 h-1 rounded-full"
                  style={{ background: "var(--gameverse-text-muted)" }}
                />
                <span>{post._count.comments} comments</span>
              </>
            )}
          </div>
        </header>

        {post.coverImage && (
          <div
            className="aspect-[2/1] overflow-hidden rounded-2xl mb-12 relative gameverse-neon-glow"
            style={{ border: "1px solid var(--gameverse-border)" }}
          >
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
          className="prose prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:transition-colors prose-img:rounded-xl prose-blockquote:border-l-[3px] prose-blockquote:not-italic"
          style={
            {
              "--tw-prose-body": "var(--gameverse-text)",
              "--tw-prose-headings": "var(--gameverse-text)",
              "--tw-prose-links": "var(--gameverse-neon-purple)",
              "--tw-prose-bold": "var(--gameverse-text)",
              "--tw-prose-quotes": "var(--gameverse-text)",
              "--tw-prose-quote-borders": "var(--gameverse-neon-purple)",
              "--tw-prose-code": "var(--gameverse-neon-cyan)",
              "--tw-prose-pre-bg": "var(--gameverse-card-bg)",
              "--tw-prose-hr": "var(--gameverse-border)",
              "--tw-prose-th-borders": "var(--gameverse-border)",
              color: "var(--gameverse-text)",
            } as React.CSSProperties
          }
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      <ReactionsBar postId={post.id} />

      <section
        className="mt-20 pt-12"
        style={{ borderTop: "1px solid var(--gameverse-border)" }}
      >
        <h2 className="text-2xl font-bold mb-2 gameverse-gradient-text">
          Comments ({commentCount ?? post._count.comments})
        </h2>
        <p
          className="text-sm mb-8"
          style={{ color: "var(--gameverse-text-muted)" }}
        >
          Share your thoughts about this post.
        </p>

        {commentTree && commentTree.length > 0 ? (
          <div className="space-y-6">
            {commentTree.map((comment) => (
              <div key={comment.id} className="gameverse-card p-5">
                <div
                  className="flex items-center gap-2 text-sm mb-2"
                  style={{ color: "var(--gameverse-text-muted)" }}
                >
                  <span
                    className="font-semibold"
                    style={{ color: "var(--gameverse-text)" }}
                  >
                    {comment.author.username}
                  </span>
                  <span
                    className="w-1 h-1 rounded-full"
                    style={{ background: "var(--gameverse-text-muted)" }}
                  />
                  <time>
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </time>
                </div>
                <p>{comment.content}</p>
                {comment.replies.length > 0 && (
                  <div
                    className="mt-4 ml-6 space-y-4 pl-4"
                    style={{ borderLeft: "1px solid var(--gameverse-border)" }}
                  >
                    {comment.replies.map((reply) => (
                      <div key={reply.id}>
                        <div
                          className="flex items-center gap-2 text-sm mb-1"
                          style={{ color: "var(--gameverse-text-muted)" }}
                        >
                          <span
                            className="font-semibold"
                            style={{ color: "var(--gameverse-text)" }}
                          >
                            {reply.author.username}
                          </span>
                          <span
                            className="w-1 h-1 rounded-full"
                            style={{
                              background: "var(--gameverse-text-muted)",
                            }}
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
          <p style={{ color: "var(--gameverse-text-muted)" }}>
            No comments yet. Be the first to share your thoughts!
          </p>
        )}
      </section>

      <hr className="gameverse-divider mt-12" />
    </main>
  );
}
