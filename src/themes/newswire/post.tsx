"use client";

import Link from "next/link";
import Image from "next/image";
import "../newswire/styles/theme.css";
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

export default function NewsWirePostPage({
  post,
  commentTree,
  commentCount,
}: PostPageProps) {
  return (
    <main className="flex-1 mx-auto max-w-4xl w-full px-4 sm:px-6 py-10">
      <article>
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            {post.category && (
              <Link
                href={`/categories/${post.category.slug}`}
                className="text-xs font-bold uppercase tracking-[0.15em] px-3 py-1"
                style={{
                  color: "#fff",
                  background: "var(--newswire-accent)",
                }}
              >
                {post.category.name}
              </Link>
            )}
            {post.tags.map((tag) => (
              <Link
                key={tag.slug}
                href={`/tags/${tag.slug}`}
                className="text-xs px-2.5 py-1 rounded transition-colors"
                style={{
                  border: "1px solid var(--newswire-border)",
                  color: "var(--newswire-text-muted)",
                }}
              >
                {tag.name}
              </Link>
            ))}
          </div>

          <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-5 newswire-headline">
            {post.title}
          </h1>

          <div
            className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm pb-6"
            style={{
              color: "var(--newswire-text-muted)",
              borderBottom: "1px solid var(--newswire-border)",
            }}
          >
            <span
              className="font-semibold"
              style={{ color: "var(--newswire-text)" }}
            >
              By {post.author.username}
            </span>
            <span
              className="w-1 h-1 rounded-full"
              style={{ background: "var(--newswire-text-muted)" }}
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
                  style={{ background: "var(--newswire-text-muted)" }}
                />
                <span>{post.readingTime} min read</span>
              </>
            )}
            {post._count.comments > 0 && (
              <>
                <span
                  className="w-1 h-1 rounded-full"
                  style={{ background: "var(--newswire-text-muted)" }}
                />
                <span>{post._count.comments} comments</span>
              </>
            )}
          </div>
        </header>

        {post.coverImage && (
          <div className="aspect-[2/1] overflow-hidden mb-10 relative">
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
          className="prose prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:transition-colors prose-img:rounded prose-blockquote:border-l-[3px] prose-blockquote:not-italic prose-blockquote:font-serif"
          style={
            {
              "--tw-prose-body": "var(--newswire-text)",
              "--tw-prose-headings": "var(--newswire-text)",
              "--tw-prose-links": "var(--newswire-accent-blue)",
              "--tw-prose-bold": "var(--newswire-text)",
              "--tw-prose-quotes": "var(--newswire-text)",
              "--tw-prose-quote-borders": "var(--newswire-accent)",
              "--tw-prose-code": "var(--newswire-text)",
              "--tw-prose-pre-bg": "var(--newswire-card-bg)",
              "--tw-prose-hr": "var(--newswire-border)",
              "--tw-prose-th-borders": "var(--newswire-border)",
              color: "var(--newswire-text)",
              fontFamily: "var(--newswire-font)",
            } as React.CSSProperties
          }
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      <ReactionsBar postId={post.id} />

      <section
        className="mt-16 pt-10"
        style={{ borderTop: "2px solid var(--newswire-accent)" }}
      >
        <h2 className="text-2xl font-black mb-2">
          Discussion ({commentCount ?? post._count.comments})
        </h2>
        <p
          className="text-sm mb-8"
          style={{ color: "var(--newswire-text-muted)" }}
        >
          Join the conversation.
        </p>

        {commentTree && commentTree.length > 0 ? (
          <div className="space-y-6">
            {commentTree.map((comment) => (
              <div key={comment.id} className="newswire-card p-5">
                <div
                  className="flex items-center gap-2 text-sm mb-2"
                  style={{ color: "var(--newswire-text-muted)" }}
                >
                  <span
                    className="font-semibold"
                    style={{ color: "var(--newswire-text)" }}
                  >
                    {comment.author.username}
                  </span>
                  <span
                    className="w-1 h-1 rounded-full"
                    style={{ background: "var(--newswire-text-muted)" }}
                  />
                  <time>
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </time>
                </div>
                <p className="text-sm">{comment.content}</p>
                {comment.replies.length > 0 && (
                  <div
                    className="mt-4 ml-6 space-y-4 pl-4"
                    style={{
                      borderLeft: "2px solid var(--newswire-accent)",
                    }}
                  >
                    {comment.replies.map((reply) => (
                      <div key={reply.id}>
                        <div
                          className="flex items-center gap-2 text-sm mb-1"
                          style={{ color: "var(--newswire-text-muted)" }}
                        >
                          <span
                            className="font-semibold"
                            style={{ color: "var(--newswire-text)" }}
                          >
                            {reply.author.username}
                          </span>
                          <span
                            className="w-1 h-1 rounded-full"
                            style={{
                              background: "var(--newswire-text-muted)",
                            }}
                          />
                          <time>
                            {new Date(reply.createdAt).toLocaleDateString()}
                          </time>
                        </div>
                        <p className="text-sm">{reply.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: "var(--newswire-text-muted)" }}>
            No comments yet. Be the first to share your thoughts!
          </p>
        )}
      </section>

      <hr className="newswire-divider mt-12" />
    </main>
  );
}
