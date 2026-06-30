import Link from "next/link";
import Image from "next/image";

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

export default function ZoomgPostPage({ post, commentTree, commentCount }: PostPageProps) {
  return (
    <main className="flex-1" dir="rtl">
      <div
        className="mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12"
        style={{ maxWidth: "min(896px, var(--zoomg-container-width))" }}
      >
        <article>
          <header className="mb-10">
            <div className="flex flex-wrap items-center gap-3 mb-5">
              {post.category && (
                <Link
                  href={`/categories/${post.category.slug}`}
                  className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full"
                  style={{
                    background: "var(--zoomg-accent-light)",
                    color: "var(--zoomg-accent)",
                  }}
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
                    border: "1px solid var(--zoomg-border)",
                    color: "var(--zoomg-text-muted)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--zoomg-accent)";
                    e.currentTarget.style.color = "var(--zoomg-accent)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--zoomg-border)";
                    e.currentTarget.style.color = "var(--zoomg-text-muted)";
                  }}
                >
                  {tag.name}
                </Link>
              ))}
            </div>

            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-6"
              style={{ color: "var(--zoomg-text-primary)" }}
            >
              {post.title}
            </h1>

            <div
              className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm pb-6"
              style={{
                color: "var(--zoomg-text-muted)",
                borderBottom: "1px solid var(--zoomg-border)",
              }}
            >
              <span className="font-medium" style={{ color: "var(--zoomg-text-primary)" }}>
                {post.author.username}
              </span>
              <span
                className="w-1 h-1 rounded-full inline-block"
                style={{ background: "var(--zoomg-text-muted)" }}
              />
              <time dateTime={post.createdAt.toISOString()}>
                {new Date(post.createdAt).toLocaleDateString("fa-IR", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </time>
              {post.readingTime && (
                <>
                  <span
                    className="w-1 h-1 rounded-full inline-block"
                    style={{ background: "var(--zoomg-text-muted)" }}
                  />
                  <span>زمان مطالعه: {post.readingTime} دقیقه</span>
                </>
              )}
              {post._count.comments > 0 && (
                <>
                  <span
                    className="w-1 h-1 rounded-full inline-block"
                    style={{ background: "var(--zoomg-text-muted)" }}
                  />
                  <span>{post._count.comments} دیدگاه</span>
                </>
              )}
            </div>
          </header>

          {post.coverImage && (
            <div
              className="aspect-[2/1] overflow-hidden rounded-xl mb-10 relative"
              style={{ background: "var(--zoomg-bg-primary)" }}
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
            className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:transition-colors prose-img:rounded-xl prose-blockquote:border-r-[3px] prose-blockquote:not-italic prose-blockquote:border-solid"
            style={
              {
                "--tw-prose-body": "var(--zoomg-text-primary)",
                "--tw-prose-headings": "var(--zoomg-text-primary)",
                "--tw-prose-links": "var(--zoomg-accent)",
                "--tw-prose-bold": "var(--zoomg-text-primary)",
                "--tw-prose-quotes": "var(--zoomg-text-primary)",
                "--tw-prose-quote-borders": "var(--zoomg-accent)",
                "--tw-prose-code": "var(--zoomg-text-primary)",
                "--tw-prose-pre-bg": "var(--zoomg-bg-primary)",
                "--tw-prose-hr": "var(--zoomg-border)",
                "--tw-prose-th-borders": "var(--zoomg-border)",
                color: "var(--zoomg-text-primary)",
              } as React.CSSProperties
            }
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

        <section
          className="mt-16 pt-10"
          style={{ borderTop: "1px solid var(--zoomg-border)" }}
        >
          <h2
            className="text-xl font-bold mb-2"
            style={{ color: "var(--zoomg-text-primary)" }}
          >
            دیدگاه‌ها ({commentCount ?? post._count.comments})
          </h2>
          <p
            className="text-sm mb-8"
            style={{ color: "var(--zoomg-text-muted)" }}
          >
            نظرات خود را درباره این مطلب بنویسید.
          </p>

          {commentTree && commentTree.length > 0 ? (
            <div className="space-y-5">
              {commentTree.map((comment) => (
                <div key={comment.id} className="zoomg-card p-5">
                  <div
                    className="flex items-center gap-2 text-sm mb-2"
                    style={{ color: "var(--zoomg-text-muted)" }}
                  >
                    <span className="font-medium" style={{ color: "var(--zoomg-text-primary)" }}>
                      {comment.author.username}
                    </span>
                    <span
                      className="w-1 h-1 rounded-full inline-block"
                      style={{ background: "var(--zoomg-text-muted)" }}
                    />
                    <time>
                      {new Date(comment.createdAt).toLocaleDateString("fa-IR")}
                    </time>
                  </div>
                  <p style={{ color: "var(--zoomg-text-primary)" }}>{comment.content}</p>
                  {comment.replies.length > 0 && (
                    <div
                      className="mt-4 mr-6 space-y-4 pr-4"
                      style={{ borderRight: "1px solid var(--zoomg-border)" }}
                    >
                      {comment.replies.map((reply) => (
                        <div key={reply.id}>
                          <div
                            className="flex items-center gap-2 text-sm mb-1"
                            style={{ color: "var(--zoomg-text-muted)" }}
                          >
                            <span className="font-medium" style={{ color: "var(--zoomg-text-primary)" }}>
                              {reply.author.username}
                            </span>
                            <span
                              className="w-1 h-1 rounded-full inline-block"
                              style={{ background: "var(--zoomg-text-muted)" }}
                            />
                            <time>
                              {new Date(reply.createdAt).toLocaleDateString("fa-IR")}
                            </time>
                          </div>
                          <p style={{ color: "var(--zoomg-text-primary)" }}>{reply.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "var(--zoomg-text-muted)" }}>
              هنوز دیدگاهی ثبت نشده. اولین نفری باشید که نظر خود را به اشتراک می‌گذارد!
            </p>
          )}
        </section>

        <hr className="zoomg-divider mt-12" />
      </div>
    </main>
  );
}
