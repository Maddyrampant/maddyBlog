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

export default function DefaultPostPage({ post, commentTree, commentCount }: PostPageProps) {
  return (
    <main className="flex-1 mx-auto max-w-4xl w-full px-4 sm:px-6 py-12">
      <article>
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            {post.category && (
              <Link
                href={`/categories/${post.category.slug}`}
                className="text-xs font-semibold uppercase tracking-widest text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              >
                {post.category.name}
              </Link>
            )}
            {post.tags.map((tag) => (
              <Link
                key={tag.slug}
                href={`/tags/${tag.slug}`}
                className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              >
                #{tag.name}
              </Link>
            ))}
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight mb-6">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-500 border-b border-zinc-200 dark:border-zinc-800 pb-6">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              {post.author.username}
            </span>
            <span>·</span>
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
                <span>·</span>
                <span>{post.readingTime} min read</span>
              </>
            )}
            {post._count.comments > 0 && (
              <>
                <span>·</span>
                <span>{post._count.comments} comments</span>
              </>
            )}
          </div>
        </header>

        {post.coverImage && (
          <div className="aspect-[2/1] overflow-hidden rounded-xl mb-10 bg-zinc-100 dark:bg-zinc-800 relative">
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
          className="prose prose-zinc dark:prose-invert prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-zinc-800 dark:prose-a:text-zinc-200 prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      <section className="mt-16 border-t border-zinc-200 dark:border-zinc-800 pt-12">
        <h2 className="text-2xl font-bold mb-2">
          Comments ({commentCount ?? post._count.comments})
        </h2>
        <p className="text-sm text-zinc-500 mb-8">
          Share your thoughts about this post.
        </p>

        {commentTree && commentTree.length > 0 ? (
          <div className="space-y-6">
            {commentTree.map((comment) => (
              <div key={comment.id} className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
                <div className="flex items-center gap-2 text-sm text-zinc-500 mb-2">
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">
                    {comment.author.username}
                  </span>
                  <span>·</span>
                  <time>{new Date(comment.createdAt).toLocaleDateString()}</time>
                </div>
                <p className="text-zinc-700 dark:text-zinc-300">{comment.content}</p>
                {comment.replies.length > 0 && (
                  <div className="mt-4 ml-6 space-y-4 border-l border-zinc-200 dark:border-zinc-800 pl-4">
                    {comment.replies.map((reply) => (
                      <div key={reply.id}>
                        <div className="flex items-center gap-2 text-sm text-zinc-500 mb-1">
                          <span className="font-medium text-zinc-700 dark:text-zinc-300">
                            {reply.author.username}
                          </span>
                          <span>·</span>
                          <time>{new Date(reply.createdAt).toLocaleDateString()}</time>
                        </div>
                        <p className="text-zinc-700 dark:text-zinc-300">{reply.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-zinc-500">No comments yet. Be the first to comment!</p>
        )}
      </section>
    </main>
  );
}
