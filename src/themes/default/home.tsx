import Link from "next/link";

type HomePageProps = {
  posts: Array<{
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    coverImage: string | null;
    createdAt: Date;
    author: { username: string };
    category: { name: string; slug: string } | null;
    tags: { name: string; slug: string }[];
    _count: { comments: number };
  }>;
  featured: HomePageProps["posts"][0] | null;
  categories: Array<{
    id: string;
    name: string;
    slug: string;
    _count: { posts: number };
  }>;
  trending: Array<{
    id: string;
    title: string;
    slug: string;
    views: number;
    commentCount: number;
  }>;
  popularTags: Array<{
    id: string;
    name: string;
    slug: string;
    postCount: number;
  }>;
};

export default function DefaultHomePage({
  posts,
  featured,
  categories,
  trending,
  popularTags,
}: HomePageProps) {
  const [latest, ...rest] = posts;

  return (
    <main className="flex-1 mx-auto max-w-6xl w-full px-4 sm:px-6 py-12">
      <section className="mb-16">
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-4">
          maddyBlog.
        </h1>
        <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl">
          Thoughts on code, design, and building things that matter.
        </p>
      </section>

      {featured && (
        <section className="mb-20">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-6">
            Featured Post
          </h2>
          <FeaturedPostCard post={featured} />
        </section>
      )}

      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-6">
          Latest Posts
        </h2>
        {latest ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[latest, ...rest].map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-zinc-500 py-12 text-center">
            No posts published yet. Check back soon.
          </p>
        )}
      </section>

      {trending.length > 0 && (
        <section className="mt-24">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-6">
            Trending Posts
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trending.map((post, i) => (
              <Link
                key={post.id}
                href={`/posts/${post.slug}`}
                className="group p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
              >
                <span className="text-2xl font-bold text-zinc-300 dark:text-zinc-700">
                  #{i + 1}
                </span>
                <h3 className="font-semibold mt-2 group-hover:text-zinc-600 dark:group-hover:text-zinc-400 transition-colors">
                  {post.title}
                </h3>
                <p className="text-xs text-zinc-500 mt-2">
                  {post.views} views · {post.commentCount} comments
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {popularTags.length > 0 && (
        <section className="mt-24">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-6">
            Popular Tags
          </h2>
          <div className="flex flex-wrap gap-3">
            {popularTags.map((tag) => (
              <Link
                key={tag.id}
                href={`/tags/${tag.slug}`}
                className="px-4 py-2 text-sm font-medium border border-zinc-300 dark:border-zinc-700 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                #{tag.name}
                <span className="ml-1.5 text-zinc-400">{tag.postCount}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {categories.length > 0 && (
        <section className="mt-24">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-6">
            Categories
          </h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="px-4 py-2 text-sm font-medium border border-zinc-300 dark:border-zinc-700 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                {cat.name}
                <span className="ml-1.5 text-zinc-400">
                  ({cat._count.posts})
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

function FeaturedPostCard({ post }: { post: HomePageProps["posts"][0] }) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      className="group block p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
        <div className="flex-1 min-w-0">
          <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
            {post.category?.name ?? "Uncategorized"}
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold mt-2 group-hover:text-zinc-600 dark:group-hover:text-zinc-400 transition-colors">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="text-zinc-600 dark:text-zinc-400 mt-3 line-clamp-2">
              {post.excerpt}
            </p>
          )}
          <div className="flex items-center gap-3 mt-4 text-sm text-zinc-500">
            <span>{post.author.username}</span>
            <span>·</span>
            <time>{new Date(post.createdAt).toLocaleDateString()}</time>
          </div>
        </div>
      </div>
    </Link>
  );
}

function PostCard({ post }: { post: HomePageProps["posts"][0] }) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      className="group block p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
    >
      <div className="flex items-center gap-2 mb-3">
        {post.tags.slice(0, 2).map((tag) => (
          <span
            key={tag.slug}
            className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
          >
            #{tag.name}
          </span>
        ))}
      </div>
      <h3 className="font-semibold group-hover:text-zinc-600 dark:group-hover:text-zinc-400 transition-colors">
        {post.title}
      </h3>
      {post.excerpt && (
        <p className="text-sm text-zinc-500 mt-2 line-clamp-2">
          {post.excerpt}
        </p>
      )}
      <div className="flex items-center gap-3 mt-4 text-xs text-zinc-400">
        <span>{post.author.username}</span>
        <span>·</span>
        <span>{post._count.comments} comments</span>
      </div>
    </Link>
  );
}
