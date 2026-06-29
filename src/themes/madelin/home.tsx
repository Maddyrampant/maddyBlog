import Link from "next/link";
import "../madelin/styles/theme.css";

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

export default function MadelinHomePage({
  posts,
  featured,
  categories,
  trending,
  popularTags,
}: HomePageProps) {
  return (
    <main className="flex-1 mx-auto max-w-6xl w-full px-4 sm:px-6 py-12">
      <section className="mb-20 text-center sm:text-left">
        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-4 madelin-gradient-text">
          Madelin.
        </h1>
        <p
          className="text-lg sm:text-xl"
          style={{ color: "var(--madelin-text-muted)" }}
        >
          Where elegance meets expression — thoughts on design, code, and
          thoughtful living.
        </p>
      </section>

      {featured && (
        <section className="mb-24">
          <div className="flex items-center gap-3 mb-8">
            <span
              className="w-8 h-px"
              style={{ background: "var(--madelin-accent)" }}
            />
            <span
              className="text-xs font-semibold uppercase tracking-[0.15em]"
              style={{ color: "var(--madelin-accent)" }}
            >
              Featured
            </span>
          </div>
          <FeaturedPostCard post={featured} />
        </section>
      )}

      <section className="mb-24">
        <div className="flex items-center gap-3 mb-8">
          <span
            className="w-8 h-px"
            style={{ background: "var(--madelin-accent)" }}
          />
          <span
            className="text-xs font-semibold uppercase tracking-[0.15em]"
            style={{ color: "var(--madelin-accent)" }}
          >
            Latest
          </span>
        </div>
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <div
                key={post.id}
                className="madelin-fade-in"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <PostCard post={post} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p
              className="text-lg"
              style={{ color: "var(--madelin-text-muted)" }}
            >
              No posts published yet. Check back soon.
            </p>
          </div>
        )}
      </section>

      {trending.length > 0 && (
        <section className="mb-24">
          <div className="flex items-center gap-3 mb-8">
            <span
              className="w-8 h-px"
              style={{ background: "var(--madelin-accent)" }}
            />
            <span
              className="text-xs font-semibold uppercase tracking-[0.15em]"
              style={{ color: "var(--madelin-accent)" }}
            >
              Trending
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trending.map((post, i) => (
              <Link
                key={post.id}
                href={`/posts/${post.slug}`}
                className="madelin-card p-6 block group"
              >
                <span
                  className="text-4xl font-bold"
                  style={{ color: "var(--madelin-accent-glow)" }}
                >
                  #{i + 1}
                </span>
                <h3
                  className="font-semibold mt-2 text-lg group-hover"
                  style={{ color: "var(--madelin-accent)" }}
                >
                  {post.title}
                </h3>
                <p
                  className="text-sm mt-2"
                  style={{ color: "var(--madelin-text-muted)" }}
                >
                  {post.views} views &middot; {post.commentCount} comments
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {popularTags.length > 0 && (
        <section className="mb-24">
          <div className="flex items-center gap-3 mb-8">
            <span
              className="w-8 h-px"
              style={{ background: "var(--madelin-accent)" }}
            />
            <span
              className="text-xs font-semibold uppercase tracking-[0.15em]"
              style={{ color: "var(--madelin-accent)" }}
            >
              Popular Tags
            </span>
          </div>
          <div className="flex flex-wrap gap-3">
            {popularTags.map((tag) => (
              <Link
                key={tag.id}
                href={`/tags/${tag.slug}`}
                className="group px-5 py-2.5 text-sm font-medium rounded-full transition-all duration-200"
                style={{
                  border: "1px solid var(--madelin-border)",
                  color: "var(--madelin-text)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--madelin-accent)";
                  e.currentTarget.style.background =
                    "var(--madelin-accent-light)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--madelin-border)";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                #{tag.name}
                <span
                  className="ml-2"
                  style={{ color: "var(--madelin-text-muted)" }}
                >
                  {tag.postCount}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {categories.length > 0 && (
        <section className="mb-24">
          <div className="flex items-center gap-3 mb-8">
            <span
              className="w-8 h-px"
              style={{ background: "var(--madelin-accent)" }}
            />
            <span
              className="text-xs font-semibold uppercase tracking-[0.15em]"
              style={{ color: "var(--madelin-accent)" }}
            >
              Categories
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="madelin-card p-5 text-center group"
              >
                <span className="block text-lg font-semibold">{cat.name}</span>
                <span
                  className="text-sm"
                  style={{ color: "var(--madelin-text-muted)" }}
                >
                  {cat._count.posts} {cat._count.posts === 1 ? "post" : "posts"}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <hr className="madelin-divider" />
    </main>
  );
}

function FeaturedPostCard({ post }: { post: HomePageProps["posts"][0] }) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      className="madelin-card p-8 sm:p-10 block group"
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
        <div className="flex-1 min-w-0">
          <span
            className="text-xs font-semibold uppercase tracking-[0.15em]"
            style={{ color: "var(--madelin-accent)" }}
          >
            {post.category?.name ?? "Uncategorized"}
          </span>
          <h3
            className="text-2xl sm:text-3xl font-bold mt-3 group-hover"
            style={{ color: "var(--madelin-accent)" }}
          >
            {post.title}
          </h3>
          {post.excerpt && (
            <p
              className="mt-3 line-clamp-2"
              style={{ color: "var(--madelin-text-muted)" }}
            >
              {post.excerpt}
            </p>
          )}
          <div
            className="flex items-center gap-4 mt-5 text-sm"
            style={{ color: "var(--madelin-text-muted)" }}
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
            <time>{new Date(post.createdAt).toLocaleDateString()}</time>
          </div>
        </div>
      </div>
    </Link>
  );
}

function PostCard({ post }: { post: HomePageProps["posts"][0] }) {
  return (
    <Link href={`/posts/${post.slug}`} className="madelin-card p-6 block group">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {post.tags.slice(0, 2).map((tag) => (
          <span
            key={tag.slug}
            className="text-xs px-2.5 py-1 rounded-full"
            style={{
              background: "var(--madelin-accent-light)",
              color: "var(--madelin-accent)",
            }}
          >
            #{tag.name}
          </span>
        ))}
      </div>
      <h3
        className="font-semibold text-lg group-hover"
        style={{ color: "var(--madelin-accent)" }}
      >
        {post.title}
      </h3>
      {post.excerpt && (
        <p
          className="text-sm mt-2 line-clamp-2"
          style={{ color: "var(--madelin-text-muted)" }}
        >
          {post.excerpt}
        </p>
      )}
      <div
        className="flex items-center gap-4 mt-5 text-xs"
        style={{ color: "var(--madelin-text-muted)" }}
      >
        <span className="font-medium" style={{ color: "var(--madelin-text)" }}>
          {post.author.username}
        </span>
        <span
          className="w-1 h-1 rounded-full"
          style={{ background: "var(--madelin-text-muted)" }}
        />
        <span>{post._count.comments} comments</span>
      </div>
    </Link>
  );
}
