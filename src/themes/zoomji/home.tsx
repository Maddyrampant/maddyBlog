"use client";

import Link from "next/link";
import "../zoomji/styles/theme.css";

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
  stories?: Array<{
    id: string;
    title: string;
    imageUrl: string;
    linkUrl: string | null;
    author: { username: string; avatarUrl: string | null };
  }>;
  slides?: Array<{
    id: string;
    title: string;
    subtitle: string | null;
    imageUrl: string;
    linkUrl: string | null;
    post?: { slug: string; title: string; coverImage: string | null } | null;
  }>;
};

export default function ZoomjiHomePage({
  posts,
  featured,
  categories,
  trending,
  popularTags,
  stories,
  slides,
}: HomePageProps) {
  return (
    <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-10">
      {stories && stories.length > 0 && (
        <section className="mb-12">
          <div className="zoomji-section-title mb-5">
            <span>Stories</span>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none">
            {stories.map((story) => (
              <Link
                key={story.id}
                href={story.linkUrl || "#"}
                className="group shrink-0"
              >
                <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-transparent hover:ring-[var(--zoomji-accent)] transition-all duration-200">
                  <img
                    src={story.imageUrl}
                    alt={story.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p
                  className="text-xs text-center mt-2 truncate w-20"
                  style={{ color: "var(--zoomji-text-muted)" }}
                >
                  {story.title}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {slides && slides.length > 0 && (
        <section className="mb-16">
          <FeaturedSlider slides={slides} />
        </section>
      )}

      {featured && (
        <section className="mb-16">
          <div className="zoomji-section-title mb-6">
            <span>Featured</span>
          </div>
          <FeaturedPostCard post={featured} />
        </section>
      )}

      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <div className="zoomji-section-title">
            <span>Latest</span>
          </div>
          {categories.length > 0 && (
            <div className="hidden sm:flex items-center gap-3 text-xs">
              {categories.slice(0, 5).map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/categories/${cat.slug}`}
                  className="transition-colors"
                  style={{ color: "var(--zoomji-text-muted)" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--zoomji-accent)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "var(--zoomji-text-muted)")
                  }
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}
        </div>
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p
              className="text-lg"
              style={{ color: "var(--zoomji-text-muted)" }}
            >
              No posts published yet. Check back soon.
            </p>
          </div>
        )}
      </section>

      {trending.length > 0 && (
        <section className="mb-16">
          <div className="zoomji-section-title mb-6">
            <span>Trending</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {trending.map((post, i) => (
              <Link
                key={post.id}
                href={`/posts/${post.slug}`}
                className="zoomji-card p-5 block group"
              >
                <div className="flex items-center gap-4">
                  <span
                    className="text-3xl font-black tabular-nums"
                    style={{ color: "var(--zoomji-accent-glow)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <h3
                      className="font-semibold text-sm group-hover transition-colors line-clamp-2"
                      style={{ color: "var(--zoomji-text)" }}
                    >
                      {post.title}
                    </h3>
                    <p
                      className="text-xs mt-1"
                      style={{ color: "var(--zoomji-text-muted)" }}
                    >
                      {post.views} views
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {popularTags.length > 0 && (
        <section className="mb-16">
          <div className="zoomji-section-title mb-6">
            <span>Tags</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <Link
                key={tag.slug}
                href={`/tags/${tag.slug}`}
                className="px-4 py-2 text-sm font-medium rounded-full transition-all duration-200"
                style={{
                  border: "1px solid var(--zoomji-border)",
                  color: "var(--zoomji-text-muted)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--zoomji-accent)";
                  e.currentTarget.style.background =
                    "var(--zoomji-accent-light)";
                  e.currentTarget.style.color = "var(--zoomji-accent)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--zoomji-border)";
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--zoomji-text-muted)";
                }}
              >
                #{tag.name}
                <span className="ml-1.5 opacity-60">{tag.postCount}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {categories.length > 0 && (
        <section className="mb-16">
          <div className="zoomji-section-title mb-6">
            <span>Categories</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="zoomji-card p-5 text-center group"
                style={{ background: "var(--zoomji-bg-subtle)" }}
              >
                <span className="block text-lg font-semibold">{cat.name}</span>
                <span
                  className="text-sm"
                  style={{ color: "var(--zoomji-text-muted)" }}
                >
                  {cat._count.posts} {cat._count.posts === 1 ? "post" : "posts"}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <hr className="zoomji-divider" />
    </main>
  );
}

function FeaturedSlider({ slides }: { slides: HomePageProps["slides"] }) {
  const slide = slides![0];
  if (!slide) return null;

  const href =
    slide.linkUrl || (slide.post ? `/posts/${slide.post.slug}` : "#");
  const img = slide.imageUrl || slide.post?.coverImage;

  return (
    <Link
      href={href}
      className="zoomji-image-overlay block aspect-[21/9] max-h-[420px]"
    >
      {img && (
        <img
          src={img}
          alt={slide.title}
          className="w-full h-full object-cover"
        />
      )}
      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
        <div className="max-w-2xl">
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-2">
            {slide.title}
          </h2>
          {slide.subtitle && (
            <p className="text-sm sm:text-base text-white/80 line-clamp-2">
              {slide.subtitle}
            </p>
          )}
        </div>
        <div className="mt-4">
          <span
            className="inline-block px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded"
            style={{ background: "var(--zoomji-accent)", color: "#fff" }}
          >
            Read More
          </span>
        </div>
      </div>
    </Link>
  );
}

function FeaturedPostCard({ post }: { post: HomePageProps["posts"][0] }) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      className="zoomji-card p-6 sm:p-8 block group"
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
        <div className="flex-1 min-w-0">
          {post.category && (
            <span
              className="text-xs font-semibold uppercase tracking-[0.15em]"
              style={{ color: "var(--zoomji-accent)" }}
            >
              {post.category.name}
            </span>
          )}
          <h3
            className="text-xl sm:text-2xl font-bold mt-2 group-hover transition-colors"
            style={{ color: "var(--zoomji-text)" }}
          >
            {post.title}
          </h3>
          {post.excerpt && (
            <p
              className="mt-2 text-sm line-clamp-2"
              style={{ color: "var(--zoomji-text-muted)" }}
            >
              {post.excerpt}
            </p>
          )}
          <div
            className="flex items-center gap-4 mt-4 text-xs"
            style={{ color: "var(--zoomji-text-muted)" }}
          >
            <span
              className="font-medium"
              style={{ color: "var(--zoomji-text)" }}
            >
              {post.author.username}
            </span>
            <span
              className="w-1 h-1 rounded-full"
              style={{ background: "var(--zoomji-text-muted)" }}
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
    <Link
      href={`/posts/${post.slug}`}
      className="zoomji-card block group overflow-hidden"
    >
      {post.coverImage && (
        <div className="aspect-[16/9] overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="p-4">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {post.category && (
            <span
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: "var(--zoomji-accent)" }}
            >
              {post.category.name}
            </span>
          )}
        </div>
        <h3
          className="font-semibold text-sm group-hover transition-colors line-clamp-2"
          style={{ color: "var(--zoomji-text)" }}
        >
          {post.title}
        </h3>
        {post.excerpt && (
          <p
            className="text-xs mt-1 line-clamp-2"
            style={{ color: "var(--zoomji-text-muted)" }}
          >
            {post.excerpt}
          </p>
        )}
        <div
          className="flex items-center gap-3 mt-3 text-xs"
          style={{ color: "var(--zoomji-text-muted)" }}
        >
          <span>{post.author.username}</span>
        </div>
      </div>
    </Link>
  );
}
