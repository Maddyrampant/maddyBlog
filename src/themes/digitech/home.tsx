"use client";

import Link from "next/link";
import "../digitech/styles/theme.css";
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

export default function DigitechHomePage({
  posts,
  featured,
  categories,
  trending,
  popularTags,
}: HomePageProps) {
  const slides = posts
    .filter((p) => p.coverImage)
    .slice(0, 5)
    .map((p) => ({
      image: p.coverImage!,
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt ?? undefined,
    }));

  const stories = posts.slice(0, 8).map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    coverImage: p.coverImage,
    category: p.category?.name,
  }));

  return (
    <main className="flex-1 mx-auto max-w-6xl w-full px-4 sm:px-6 py-8">
      <section className="mb-8">
        <div className="mb-6">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight digitech-gradient-text">
            DigiTech
          </h1>
          <p
            className="text-base sm:text-lg mt-2"
            style={{ color: "var(--digitech-text-muted)" }}
          >
            Exploring the future of code, cloud, and digital innovation.
          </p>
        </div>
        {slides.length > 0 && (
          <div className="digitech-fade-in">
            <ImageSlider slides={slides} />
          </div>
        )}
      </section>

      {stories.length > 0 && (
        <section className="mb-12">
          <StoriesBar stories={stories} />
        </section>
      )}

      {featured && (
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: "var(--digitech-neon)",
                boxShadow: "0 0 6px var(--digitech-neon)",
              }}
            />
            <span
              className="text-xs font-semibold uppercase tracking-[0.15em]"
              style={{ color: "var(--digitech-neon)" }}
            >
              Featured Post
            </span>
          </div>
          <FeaturedPostCard post={featured} />
        </section>
      )}

      <section className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: "var(--digitech-neon)",
              boxShadow: "0 0 6px var(--digitech-neon)",
            }}
          />
          <span
            className="text-xs font-semibold uppercase tracking-[0.15em]"
            style={{ color: "var(--digitech-neon)" }}
          >
            Latest Posts
          </span>
        </div>
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <div
                key={post.id}
                className="digitech-fade-in"
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
              style={{ color: "var(--digitech-text-muted)" }}
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
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: "var(--digitech-neon)",
                boxShadow: "0 0 6px var(--digitech-neon)",
              }}
            />
            <span
              className="text-xs font-semibold uppercase tracking-[0.15em]"
              style={{ color: "var(--digitech-neon)" }}
            >
              Trending Now
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trending.map((post, i) => (
              <Link
                key={post.id}
                href={`/posts/${post.slug}`}
                className="digitech-card p-6 block group"
              >
                <span
                  className="text-4xl font-bold"
                  style={{ color: "var(--digitech-accent-glow)" }}
                >
                  #{i + 1}
                </span>
                <h3
                  className="font-semibold mt-2 text-lg transition-colors"
                  style={{ color: "var(--digitech-text)" }}
                >
                  {post.title}
                </h3>
                <p
                  className="text-sm mt-2"
                  style={{ color: "var(--digitech-text-muted)" }}
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
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: "var(--digitech-neon)",
                boxShadow: "0 0 6px var(--digitech-neon)",
              }}
            />
            <span
              className="text-xs font-semibold uppercase tracking-[0.15em]"
              style={{ color: "var(--digitech-neon)" }}
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
                  border: "1px solid var(--digitech-border)",
                  color: "var(--digitech-text)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--digitech-neon)";
                  e.currentTarget.style.background =
                    "var(--digitech-neon-glow)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--digitech-border)";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                #{tag.name}
                <span
                  className="ml-2"
                  style={{ color: "var(--digitech-text-muted)" }}
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
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: "var(--digitech-neon)",
                boxShadow: "0 0 6px var(--digitech-neon)",
              }}
            />
            <span
              className="text-xs font-semibold uppercase tracking-[0.15em]"
              style={{ color: "var(--digitech-neon)" }}
            >
              Categories
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="digitech-card p-5 text-center group"
              >
                <span className="block text-lg font-semibold">{cat.name}</span>
                <span
                  className="text-sm"
                  style={{ color: "var(--digitech-text-muted)" }}
                >
                  {cat._count.posts} {cat._count.posts === 1 ? "post" : "posts"}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <hr className="digitech-divider" />
    </main>
  );
}

function FeaturedPostCard({ post }: { post: HomePageProps["posts"][0] }) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      className="digitech-card overflow-hidden block group"
    >
      {post.coverImage && (
        <div className="aspect-[21/9] relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url(${post.coverImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--digitech-card-bg)] via-[var(--digitech-card-bg)]/60 to-transparent" />
        </div>
      )}
      <div className="p-6 sm:p-8">
        <span
          className="text-xs font-semibold uppercase tracking-[0.15em]"
          style={{ color: "var(--digitech-accent)" }}
        >
          {post.category?.name ?? "Uncategorized"}
        </span>
        <h3
          className="text-2xl sm:text-3xl font-bold mt-2 transition-colors"
          style={{ color: "var(--digitech-text)" }}
        >
          {post.title}
        </h3>
        {post.excerpt && (
          <p
            className="mt-3 line-clamp-2"
            style={{ color: "var(--digitech-text-muted)" }}
          >
            {post.excerpt}
          </p>
        )}
        <div
          className="flex items-center gap-4 mt-5 text-sm"
          style={{ color: "var(--digitech-text-muted)" }}
        >
          <span
            className="font-medium"
            style={{ color: "var(--digitech-text)" }}
          >
            {post.author.username}
          </span>
          <span
            className="w-1 h-1 rounded-full"
            style={{ background: "var(--digitech-text-muted)" }}
          />
          <time>{new Date(post.createdAt).toLocaleDateString()}</time>
        </div>
      </div>
    </Link>
  );
}

function PostCard({ post }: { post: HomePageProps["posts"][0] }) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      className="digitech-card overflow-hidden block group"
    >
      {post.coverImage && (
        <div className="aspect-[16/9] relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url(${post.coverImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--digitech-card-bg)] to-transparent" />
        </div>
      )}
      <div className="p-5">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {post.tags.slice(0, 2).map((tag) => (
            <span
              key={tag.slug}
              className="text-xs px-2.5 py-1 rounded-full"
              style={{
                background: "var(--digitech-accent-glow)",
                color: "var(--digitech-accent)",
              }}
            >
              #{tag.name}
            </span>
          ))}
        </div>
        <h3
          className="font-semibold text-lg transition-colors"
          style={{ color: "var(--digitech-text)" }}
        >
          {post.title}
        </h3>
        {post.excerpt && (
          <p
            className="text-sm mt-2 line-clamp-2"
            style={{ color: "var(--digitech-text-muted)" }}
          >
            {post.excerpt}
          </p>
        )}
        <div
          className="flex items-center gap-4 mt-4 text-xs"
          style={{ color: "var(--digitech-text-muted)" }}
        >
          <span
            className="font-medium"
            style={{ color: "var(--digitech-text)" }}
          >
            {post.author.username}
          </span>
          <span
            className="w-1 h-1 rounded-full"
            style={{ background: "var(--digitech-text-muted)" }}
          />
          <span>{post._count.comments} comments</span>
        </div>
      </div>
    </Link>
  );
}
