import Link from "next/link";
import Image from "next/image";
import "./styles/theme.css";
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

export default function PersonalBlogPostPage({
  post,
  commentTree,
  commentCount,
}: PostPageProps) {
  return (
    <main className="flex-1 mx-auto max-w-3xl w-full px-4 sm:px-6 py-16">
      <article>
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span
              className="w-8 h-px"
              style={{ background: "var(--personalblog-accent)" }}
            />
            {post.category && (
              <Link
                href={`/categories/${post.category.slug}`}
                className="text-xs font-semibold uppercase tracking-[0.15em] transition-colors"
                style={{ color: "var(--personalblog-accent)" }}
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
                  background: "var(--personalblog-accent-light)",
                  color: "var(--personalblog-accent)",
                }}
              >
                #{tag.name}
              </Link>
            ))}
          </div>

          <h1 className="personalblog-heading text-4xl sm:text-5xl leading-tight mb-6">
            {post.title}
          </h1>

          <div
            className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm pb-8"
            style={{
              color: "var(--personalblog-text-muted)",
              borderBottom: "1px solid var(--personalblog-border)",
            }}
          >
            <span
              className="font-medium"
              style={{ color: "var(--personalblog-text)" }}
            >
              {post.author.username}
            </span>
            <span
              className="w-1 h-1 rounded-full"
              style={{ background: "var(--personalblog-text-muted)" }}
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
                  style={{ background: "var(--personalblog-text-muted)" }}
                />
                <span>{post.readingTime} min read</span>
              </>
            )}
            {post._count.comments > 0 && (
              <>
                <span
                  className="w-1 h-1 rounded-full"
                  style={{ background: "var(--personalblog-text-muted)" }}
                />
                <span>{post._count.comments} comments</span>
              </>
            )}
          </div>
        </header>

        {post.coverImage && (
          <div className="aspect-[2/1] overflow-hidden rounded-2xl mb-12 relative">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>
        )}

        <div
          className="prose prose-lg max-w-none"
          style={
            {
              "--tw-prose-body": "var(--personalblog-text)",
              "--tw-prose-headings": "var(--personalblog-text)",
              "--tw-prose-links": "var(--personalblog-accent)",
              "--tw-prose-bold": "var(--personalblog-text)",
              "--tw-prose-quotes": "var(--personalblog-text)",
              "--tw-prose-quote-borders": "var(--personalblog-accent)",
              "--tw-prose-code": "var(--personalblog-text)",
              "--tw-prose-pre-bg": "var(--personalblog-prose-bg)",
              "--tw-prose-hr": "var(--personalblog-border)",
              "--tw-prose-th-borders": "var(--personalblog-border)",
              color: "var(--personalblog-text)",
            } as React.CSSProperties
          }
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      <ReactionsBar postId={post.id} />

      <section
        className="mt-20 pt-12"
        style={{ borderTop: "1px solid var(--personalblog-border)" }}
      >
        <h2 className="personalblog-heading text-2xl mb-2">
          Comments ({commentCount ?? post._count.comments})
        </h2>
        <p
          className="text-sm mb-8"
          style={{ color: "var(--personalblog-text-muted)" }}
        >
          Share your thoughts about this post.
        </p>

        {commentTree && commentTree.length > 0 ? (
          <div className="space-y-6">
            {commentTree.map((comment) => (
              <div key={comment.id} className="personalblog-card p-5">
                <div
                  className="flex items-center gap-2 text-sm mb-2"
                  style={{ color: "var(--personalblog-text-muted)" }}
                >
                  <span
                    className="font-medium"
                    style={{ color: "var(--personalblog-text)" }}
                  >
                    {comment.author.username}
                  </span>
                  <span
                    className="w-1 h-1 rounded-full"
                    style={{ background: "var(--personalblog-text-muted)" }}
                  />
                  <time>
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </time>
                </div>
                <p>{comment.content}</p>
                {comment.replies.length > 0 && (
                  <div
                    className="mt-4 ml-6 space-y-4 pl-4"
                    style={{
                      borderLeft: "1px solid var(--personalblog-border)",
                    }}
                  >
                    {comment.replies.map((reply) => (
                      <div key={reply.id}>
                        <div
                          className="flex items-center gap-2 text-sm mb-1"
                          style={{ color: "var(--personalblog-text-muted)" }}
                        >
                          <span
                            className="font-medium"
                            style={{ color: "var(--personalblog-text)" }}
                          >
                            {reply.author.username}
                          </span>
                          <span
                            className="w-1 h-1 rounded-full"
                            style={{
                              background: "var(--personalblog-text-muted)",
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
          <p style={{ color: "var(--personalblog-text-muted)" }}>
            No comments yet. Be the first to share your thoughts!
          </p>
        )}
      </section>

      <hr className="personalblog-divider mt-12" />
    </main>
  );
}
