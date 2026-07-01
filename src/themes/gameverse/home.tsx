"use client";

import Link from "next/link";
import "../gameverse/styles/theme.css";
import { ImageSlider } from "@/components/shared/ImageSlider";
import { StoriesBar } from "@/components/shared/StoriesBar";

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

export default function GameverseHomePage({
  posts,
  featured,
  categories,
  trending,
  popularTags,
}: HomePageProps) {
  const heroSlides = featured
    ? [
        {
          image: featured.coverImage || "/placeholder.jpg",
          title: featured.title,
          slug: featured.slug,
          excerpt: featured.excerpt || undefined,
        },
      ]
    : [];

  const stories = posts.slice(0, 8).map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    coverImage: p.coverImage,
    category: p.category?.name,
  }));

  return (
    <main className="flex-1 mx-auto max-w-6xl w-full px-4 sm:px-6 py-8">
      <section className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-5xl sm:text-7xl font-black tracking-tight gameverse-gradient-text leading-tight">
              GameVerse
            </h1>
            <p
              className="text-base sm:text-lg mt-2 font-mono tracking-wide"
              style={{ color: "var(--gameverse-neon-cyan)" }}
            >
              Level up your reading experience.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 gameverse-badge text-base px-4 py-2">
            LIVE
          </div>
        </div>
      </section>

      {heroSlides.length > 0 && (
        <section className="mb-8">
          <ImageSlider slides={heroSlides} />
        </section>
      )}

      {stories.length > 0 && (
        <section className="mb-12">
          <StoriesBar stories={stories} />
        </section>
      )}

      {featured && (
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span
              className="inline-block w-2 h-2 rounded-full gameverse-pulse"
              style={{ backgroundColor: "var(--gameverse-neon-pink)" }}
            />
            <span
              className="text-xs font-bold uppercase tracking-[0.15em]"
              style={{ color: "var(--gameverse-neon-pink)" }}
            >
              Featured
            </span>
            <span className="gameverse-badge ml-auto">HOT</span>
          </div>
          <FeaturedPostCard post={featured} />
        </section>
      )}

      <section className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <span
            className="inline-block w-2 h-2 rounded-full gameverse-pulse"
            style={{ backgroundColor: "var(--gameverse-neon-purple)" }}
          />
          <span
            className="text-xs font-bold uppercase tracking-[0.15em]"
            style={{ color: "var(--gameverse-neon-purple)" }}
          >
            Latest
          </span>
        </div>
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <div
                key={post.id}
                className="gameverse-fade-in"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <PostCard post={post} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 gameverse-card p-12">
            <p
              className="text-lg"
              style={{ color: "var(--gameverse-text-muted)" }}
            >
              No posts published yet. Check back soon.
            </p>
          </div>
        )}
      </section>

      {trending.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span
              className="inline-block w-2 h-2 rounded-full gameverse-pulse"
              style={{ backgroundColor: "var(--gameverse-neon-cyan)" }}
            />
            <span
              className="text-xs font-bold uppercase tracking-[0.15em]"
              style={{ color: "var(--gameverse-neon-cyan)" }}
            >
              Trending
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trending.map((post, i) => (
              <Link
                key={post.id}
                href={`/posts/${post.slug}`}
                className="gameverse-card p-6 block group"
              >
                <div className="flex items-center gap-4 mb-3">
                  <span
                    className="text-5xl font-black tracking-tighter"
                    style={{
                      color: "var(--gameverse-neon-cyan)",
                      textShadow: "0 0 20px rgba(34,211,238,0.3)",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3
                  className="font-bold text-lg group-hover"
                  style={{ color: "var(--gameverse-text)" }}
                >
                  {post.title}
                </h3>
                <p
                  className="text-sm mt-2 font-mono"
                  style={{ color: "var(--gameverse-text-muted)" }}
                >
                  {post.views} views &middot; {post.commentCount} comments
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {popularTags.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span
              className="inline-block w-2 h-2 rounded-full gameverse-pulse"
              style={{ backgroundColor: "var(--gameverse-neon-purple)" }}
            />
            <span
              className="text-xs font-bold uppercase tracking-[0.15em]"
              style={{ color: "var(--gameverse-neon-purple)" }}
            >
              Popular Tags
            </span>
          </div>
          <div className="flex flex-wrap gap-3">
            {popularTags.map((tag) => (
              <Link
                key={tag.id}
                href={`/tags/${tag.slug}`}
                className="group px-5 py-2.5 text-sm font-semibold rounded-full transition-all duration-200"
                style={{
                  border: "1px solid var(--gameverse-border)",
                  color: "var(--gameverse-text)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor =
                    "var(--gameverse-neon-purple)";
                  e.currentTarget.style.background =
                    "var(--gameverse-accent-light)";
                  e.currentTarget.style.boxShadow =
                    "0 0 20px var(--gameverse-accent-glow)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--gameverse-border)";
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                #{tag.name}
                <span
                  className="ml-2"
                  style={{ color: "var(--gameverse-text-muted)" }}
                >
                  {tag.postCount}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {categories.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span
              className="inline-block w-2 h-2 rounded-full gameverse-pulse"
              style={{ backgroundColor: "var(--gameverse-neon-purple)" }}
            />
            <span
              className="text-xs font-bold uppercase tracking-[0.15em]"
              style={{ color: "var(--gameverse-neon-purple)" }}
            >
              Game Genres
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="gameverse-card p-5 text-center group"
              >
                <span className="block text-lg font-bold">{cat.name}</span>
                <span
                  className="text-sm font-mono"
                  style={{ color: "var(--gameverse-text-muted)" }}
                >
                  {cat._count.posts} {cat._count.posts === 1 ? "post" : "posts"}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <hr className="gameverse-divider" />
    </main>
  );
}

function FeaturedPostCard({ post }: { post: HomePageProps["posts"][0] }) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      className="gameverse-card p-8 sm:p-10 block group relative overflow-hidden"
    >
      <div className="absolute top-4 right-4 gameverse-badge z-10">NEW</div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
        <div className="flex-1 min-w-0">
          <span
            className="text-xs font-bold uppercase tracking-[0.15em]"
            style={{ color: "var(--gameverse-neon-purple)" }}
          >
            {post.category?.name ?? "Uncategorized"}
          </span>
          <h3 className="text-2xl sm:text-3xl font-black mt-3 leading-tight gameverse-gradient-text">
            {post.title}
          </h3>
          {post.excerpt && (
            <p
              className="mt-3 line-clamp-2"
              style={{ color: "var(--gameverse-text-muted)" }}
            >
              {post.excerpt}
            </p>
          )}
          <div
            className="flex items-center gap-4 mt-5 text-sm"
            style={{ color: "var(--gameverse-text-muted)" }}
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
      className="gameverse-card p-6 block group"
    >
      {post.coverImage && (
        <div className="aspect-[16/9] overflow-hidden rounded-lg mb-4 relative">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      )}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {post.tags.slice(0, 2).map((tag) => (
          <span
            key={tag.slug}
            className="text-xs px-2.5 py-1 rounded-full font-semibold"
            style={{
              background: "var(--gameverse-accent-light)",
              color: "var(--gameverse-neon-purple)",
            }}
          >
            #{tag.name}
          </span>
        ))}
      </div>
      <h3
        className="font-bold text-lg leading-tight group-hover"
        style={{ color: "var(--gameverse-text)" }}
      >
        {post.title}
      </h3>
      {post.excerpt && (
        <p
          className="text-sm mt-2 line-clamp-2"
          style={{ color: "var(--gameverse-text-muted)" }}
        >
          {post.excerpt}
        </p>
      )}
      <div
        className="flex items-center gap-4 mt-4 text-xs font-mono"
        style={{ color: "var(--gameverse-text-muted)" }}
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
        <span>{post._count.comments} comments</span>
      </div>
    </Link>
  );
}
