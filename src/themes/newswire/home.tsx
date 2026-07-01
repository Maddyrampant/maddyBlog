"use client";

import Link from "next/link";
import "../newswire/styles/theme.css";
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

export default function NewsWireHomePage({
  posts,
  featured,
  categories,
  trending,
  popularTags,
}: HomePageProps) {
  const latestTitles = posts.slice(0, 6).map((p) => p.title);

  return (
    <main className="flex-1">
      <div className="newswire-breaking-news">
        <span className="newswire-breaking-label">BREAKING</span>
        <div className="newswire-ticker-wrapper">
          <div className="newswire-ticker-track">
            {[...latestTitles, ...latestTitles].map((title, i) => (
              <span key={i} className="newswire-ticker-item">
                {title}
                <span className="newswire-ticker-sep">•</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <section className="py-8">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight newswire-gradient-text">
            NewsWire
          </h1>
          <p
            className="text-base sm:text-lg mt-2 font-serif"
            style={{ color: "var(--newswire-text-muted)" }}
          >
            Stay informed. Stay ahead.
          </p>
        </section>

        <section className="mb-10">
          <ImageSlider
            slides={posts.slice(0, 5).map((p) => ({
              image: p.coverImage ?? "/placeholder.jpg",
              title: p.title,
              slug: p.slug,
              excerpt: p.excerpt ?? undefined,
            }))}
          />
        </section>

        <section className="mb-10">
          <StoriesBar
            stories={posts.slice(0, 6).map((p) => ({
              id: p.id,
              title: p.title,
              slug: p.slug,
              coverImage: p.coverImage,
              category: p.category?.name,
            }))}
          />
        </section>

        {featured && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span
                className="w-10 h-0.5"
                style={{ background: "var(--newswire-accent)" }}
              />
              <span
                className="text-xs font-bold uppercase tracking-[0.15em]"
                style={{ color: "var(--newswire-accent)" }}
              >
                Featured Story
              </span>
            </div>
            <FeaturedPostCard post={featured} />
          </section>
        )}

        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span
              className="w-10 h-0.5"
              style={{ background: "var(--newswire-accent)" }}
            />
            <span
              className="text-xs font-bold uppercase tracking-[0.15em]"
              style={{ color: "var(--newswire-accent)" }}
            >
              Latest News
            </span>
          </div>
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {posts.slice(0, 6).map((post, i) => (
                  <div
                    key={post.id}
                    className="newswire-fade-in"
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <PostCard post={post} />
                  </div>
                ))}
              </div>
              <aside className="space-y-8">
                <SidebarSection
                  title="Most Read"
                  items={trending.map((t) => ({
                    id: t.id,
                    title: t.title,
                    slug: t.slug,
                    subtitle: `${t.views} views`,
                  }))}
                />
                <SidebarSection
                  title="Categories"
                  items={categories.map((c) => ({
                    id: c.id,
                    title: c.name,
                    slug: c.slug,
                    subtitle: `${c._count.posts} posts`,
                  }))}
                />
              </aside>
            </div>
          ) : (
            <div className="text-center py-16">
              <p
                className="text-lg"
                style={{ color: "var(--newswire-text-muted)" }}
              >
                No posts published yet. Check back soon.
              </p>
            </div>
          )}
        </section>
      </div>

      {trending.length > 0 && (
        <section className="mb-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex items-center gap-3 mb-6">
              <span
                className="w-10 h-0.5"
                style={{ background: "var(--newswire-accent)" }}
              />
              <span
                className="text-xs font-bold uppercase tracking-[0.15em]"
                style={{ color: "var(--newswire-accent)" }}
              >
                Trending Now
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {trending.slice(0, 4).map((post, i) => (
                <Link
                  key={post.id}
                  href={`/posts/${post.slug}`}
                  className="newswire-card p-5 block group"
                >
                  <span
                    className="text-3xl font-black"
                    style={{ color: "var(--newswire-accent)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3
                    className="font-bold mt-2 text-base group-hover"
                    style={{ color: "var(--newswire-text)" }}
                  >
                    {post.title}
                  </h3>
                  <p
                    className="text-xs mt-2"
                    style={{ color: "var(--newswire-text-muted)" }}
                  >
                    {post.views} views &middot; {post.commentCount} comments
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {popularTags.length > 0 && (
        <section className="mb-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex items-center gap-3 mb-6">
              <span
                className="w-10 h-0.5"
                style={{ background: "var(--newswire-accent)" }}
              />
              <span
                className="text-xs font-bold uppercase tracking-[0.15em]"
                style={{ color: "var(--newswire-accent)" }}
              >
                Trending Topics
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              {popularTags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/tags/${tag.slug}`}
                  className="group px-4 py-2 text-sm font-medium rounded transition-all"
                  style={{
                    border: "1px solid var(--newswire-border)",
                    color: "var(--newswire-text)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor =
                      "var(--newswire-accent-blue)";
                    e.currentTarget.style.color = "var(--newswire-accent-blue)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor =
                      "var(--newswire-border)";
                    e.currentTarget.style.color = "var(--newswire-text)";
                  }}
                >
                  {tag.name}
                  <span
                    className="ml-2 text-xs"
                    style={{ color: "var(--newswire-text-muted)" }}
                  >
                    {tag.postCount}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {categories.length > 0 && (
        <section className="mb-12 pb-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex items-center gap-3 mb-6">
              <span
                className="w-10 h-0.5"
                style={{ background: "var(--newswire-accent)" }}
              />
              <span
                className="text-xs font-bold uppercase tracking-[0.15em]"
                style={{ color: "var(--newswire-accent)" }}
              >
                Sections
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  className="newswire-card p-4 text-center group"
                >
                  <span className="block text-sm font-bold">{cat.name}</span>
                  <span
                    className="text-xs"
                    style={{ color: "var(--newswire-text-muted)" }}
                  >
                    {cat._count.posts}{" "}
                    {cat._count.posts === 1 ? "article" : "articles"}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <hr className="newswire-divider" />
    </main>
  );
}

function FeaturedPostCard({ post }: { post: HomePageProps["posts"][0] }) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      className="newswire-card overflow-hidden block group"
    >
      <div className="flex flex-col lg:flex-row">
        {post.coverImage && (
          <div className="lg:w-1/2 aspect-[16/9] lg:aspect-auto relative overflow-hidden">
            <div
              className="w-full h-full absolute inset-0"
              style={{
                background: `url(${post.coverImage}) center/cover no-repeat`,
              }}
            />
          </div>
        )}
        <div className="lg:w-1/2 p-6 lg:p-8 flex flex-col justify-center">
          <span
            className="text-xs font-bold uppercase tracking-[0.15em] mb-3"
            style={{ color: "var(--newswire-accent)" }}
          >
            {post.category?.name ?? "Uncategorized"}
          </span>
          <h3
            className="text-2xl lg:text-3xl font-black leading-tight mb-3 newswire-headline"
            style={{ color: "var(--newswire-text)" }}
          >
            {post.title}
          </h3>
          {post.excerpt && (
            <p
              className="text-sm line-clamp-3 mb-4 font-serif"
              style={{ color: "var(--newswire-text-muted)" }}
            >
              {post.excerpt}
            </p>
          )}
          <div
            className="flex items-center gap-3 text-xs"
            style={{ color: "var(--newswire-text-muted)" }}
          >
            <span
              className="font-semibold"
              style={{ color: "var(--newswire-text)" }}
            >
              {post.author.username}
            </span>
            <span
              className="w-1 h-1 rounded-full"
              style={{ background: "var(--newswire-text-muted)" }}
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
      className="newswire-card p-5 block group"
    >
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <span
            className="text-xs font-bold uppercase tracking-[0.1em]"
            style={{ color: "var(--newswire-accent)" }}
          >
            {post.category?.name ?? "Uncategorized"}
          </span>
          <h3
            className="font-bold text-lg mt-1 leading-tight group-hover"
            style={{ color: "var(--newswire-text)" }}
          >
            {post.title}
          </h3>
          {post.excerpt && (
            <p
              className="text-sm mt-1 line-clamp-2"
              style={{ color: "var(--newswire-text-muted)" }}
            >
              {post.excerpt}
            </p>
          )}
          <div
            className="flex items-center gap-3 mt-3 text-xs"
            style={{ color: "var(--newswire-text-muted)" }}
          >
            <span
              className="font-semibold"
              style={{ color: "var(--newswire-text)" }}
            >
              {post.author.username}
            </span>
            <span
              className="w-1 h-1 rounded-full"
              style={{ background: "var(--newswire-text-muted)" }}
            />
            <time>{new Date(post.createdAt).toLocaleDateString()}</time>
          </div>
        </div>
      </div>
    </Link>
  );
}

function SidebarSection({
  title,
  items,
}: {
  title: string;
  items: { id: string; title: string; slug: string; subtitle: string }[];
}) {
  return (
    <div>
      <h3
        className="text-xs font-bold uppercase tracking-[0.15em] mb-4 pb-2"
        style={{
          color: "var(--newswire-accent)",
          borderBottom: "2px solid var(--newswire-accent)",
        }}
      >
        {title}
      </h3>
      <div className="space-y-3">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/posts/${item.slug}`}
            className="block py-2 border-b group"
            style={{ borderColor: "var(--newswire-border)" }}
          >
            <span
              className="text-sm font-semibold leading-tight block group-hover"
              style={{ color: "var(--newswire-text)" }}
            >
              {item.title}
            </span>
            <span
              className="text-xs"
              style={{ color: "var(--newswire-text-muted)" }}
            >
              {item.subtitle}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
