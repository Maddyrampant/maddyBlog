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

export default function DefaultRelatedPosts({
  posts,
  title = "Related Posts",
}: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-16 border-t border-zinc-200 dark:border-zinc-800 pt-12">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/posts/${post.slug}`}
            className="group block p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
          >
            <h3 className="font-semibold group-hover:text-zinc-600 dark:group-hover:text-zinc-400 transition-colors">
              {post.title}
            </h3>
            {post.excerpt && (
              <p className="text-sm text-zinc-500 mt-2 line-clamp-2">
                {post.excerpt}
              </p>
            )}
            <div className="flex items-center gap-2 mt-3 text-xs text-zinc-400">
              <span>{post.author.username}</span>
              <span>·</span>
              <time>{new Date(post.createdAt).toLocaleDateString()}</time>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
