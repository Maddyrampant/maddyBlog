import Link from "next/link";
import Image from "next/image";
import "../edupro/styles/theme.css";
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

export default function EduProPostPage({
  post,
  commentTree,
  commentCount,
}: PostPageProps) {
  return (
    <main className="flex-1 mx-auto max-w-4xl w-full px-4 sm:px-6 py-12">
      <article>
        <header className="mb-12">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span
              className="edupro-subject-badge"
              style={{
                background: "var(--edupro-accent-light)",
                color: "var(--edupro-accent)",
              }}
            >
              {post.category?.name ?? "Lesson"}
            </span>
            {post.tags.map((tag) => (
              <Link
                key={tag.slug}
                href={`/tags/${tag.slug}`}
                className="text-xs px-2.5 py-1 rounded-full transition-colors"
                style={{
                  background: "var(--edupro-accent-light)",
                  color: "var(--edupro-accent)",
                }}
              >
                {tag.name}
              </Link>
            ))}
          </div>

          <h1
            className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight mb-6"
            style={{ fontFamily: "var(--edupro-font-heading)" }}
          >
            {post.title}
          </h1>

          <div
            className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm pb-8"
            style={{
              color: "var(--edupro-text-muted)",
              borderBottom: "1px solid var(--edupro-border)",
            }}
          >
            <span
              className="font-medium"
              style={{ color: "var(--edupro-text)" }}
            >
              {post.author.username}
            </span>
            <span
              className="w-1 h-1 rounded-full"
              style={{ background: "var(--edupro-text-muted)" }}
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
                  style={{ background: "var(--edupro-text-muted)" }}
                />
                <span className="flex items-center gap-1.5">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                  </svg>
                  {post.readingTime} min read
                </span>
              </>
            )}
            {post._count.comments > 0 && (
              <>
                <span
                  className="w-1 h-1 rounded-full"
                  style={{ background: "var(--edupro-text-muted)" }}
                />
                <span>{post._count.comments} comments</span>
              </>
            )}
          </div>
        </header>

        {post.coverImage && (
          <div className="edupro-card overflow-hidden mb-12 relative aspect-[2/1]">
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
          className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:transition-colors prose-img:rounded-xl prose-blockquote:border-l-[3px] prose-blockquote:not-italic prose-code:before:content-none prose-code:after:content-none"
          style={
            {
              "--tw-prose-body": "var(--edupro-text)",
              "--tw-prose-headings": "var(--edupro-text)",
              "--tw-prose-links": "var(--edupro-accent)",
              "--tw-prose-bold": "var(--edupro-text)",
              "--tw-prose-quotes": "var(--edupro-text)",
              "--tw-prose-quote-borders": "var(--edupro-accent)",
              "--tw-prose-code": "var(--edupro-accent-blue)",
              "--tw-prose-pre-bg": "#0f172a",
              "--tw-prose-hr": "var(--edupro-border)",
              "--tw-prose-th-borders": "var(--edupro-border)",
              color: "var(--edupro-text)",
              fontFamily: "var(--edupro-font)",
            } as React.CSSProperties
          }
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      <div className="mt-12">
        <ReactionsBar postId={post.id} />
      </div>

      <section
        className="mt-20 pt-12"
        style={{ borderTop: "1px solid var(--edupro-border)" }}
      >
        <h2 className="text-2xl font-bold mb-2">
          Discussion ({commentCount ?? post._count.comments})
        </h2>
        <p
          className="text-sm mb-8"
          style={{ color: "var(--edupro-text-muted)" }}
        >
          Share your questions and insights about this lesson.
        </p>

        {commentTree && commentTree.length > 0 ? (
          <div className="space-y-6">
            {commentTree.map((comment) => (
              <div key={comment.id} className="edupro-card p-5">
                <div
                  className="flex items-center gap-2 text-sm mb-2"
                  style={{ color: "var(--edupro-text-muted)" }}
                >
                  <span
                    className="font-medium"
                    style={{ color: "var(--edupro-text)" }}
                  >
                    {comment.author.username}
                  </span>
                  <span
                    className="w-1 h-1 rounded-full"
                    style={{ background: "var(--edupro-text-muted)" }}
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
                      borderLeft: "2px solid var(--edupro-accent-light)",
                    }}
                  >
                    {comment.replies.map((reply) => (
                      <div key={reply.id}>
                        <div
                          className="flex items-center gap-2 text-sm mb-1"
                          style={{ color: "var(--edupro-text-muted)" }}
                        >
                          <span
                            className="font-medium"
                            style={{ color: "var(--edupro-text)" }}
                          >
                            {reply.author.username}
                          </span>
                          <span
                            className="w-1 h-1 rounded-full"
                            style={{ background: "var(--edupro-text-muted)" }}
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
          <p style={{ color: "var(--edupro-text-muted)" }}>
            No discussion yet. Start the conversation!
          </p>
        )}
      </section>

      <hr className="edupro-divider mt-12" />
    </main>
  );
}
