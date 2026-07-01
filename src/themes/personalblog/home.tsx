"use client";

import Link from "next/link";
import "./styles/theme.css";
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

export default function PersonalBlogHomePage({
  posts,
  featured,
  categories,
  trending,
  popularTags,
}: HomePageProps) {
  return (
    <main className="flex-1 mx-auto max-w-5xl w-full px-4 sm:px-6 py-16">
      <section className="mb-16 text-center">
        <h1 className="personalblog-heading text-5xl sm:text-6xl mb-4 personalblog-gradient-text">
          PersonalBlog.
        </h1>
        <p
          className="text-lg max-w-xl mx-auto"
          style={{ color: "var(--personalblog-text-muted)" }}
        >
          Thoughts on making, writing, and living thoughtfully.
        </p>
      </section>

      <section className="mb-16">
        <ImageSlider
          slides={[
            {
              image: "/slides/writing.jpg",
              title: "Writing",
              link: "/categories/writing",
            },
            {
              image: "/slides/ideas.jpg",
              title: "Ideas",
              link: "/categories/ideas",
            },
            {
              image: "/slides/life.jpg",
              title: "Life",
              link: "/categories/life",
            },
          ]}
        />
      </section>

      <section className="mb-16">
        <StoriesBar
          stories={posts.slice(0, 5).map((p) => ({
            id: p.id,
            title: p.title,
            slug: p.slug,
            coverImage: p.coverImage,
          }))}
        />
      </section>

      {featured && (
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <span
              className="w-8 h-px"
              style={{ background: "var(--personalblog-accent)" }}
            />
            <span
              className="text-xs font-semibold uppercase tracking-[0.15em]"
              style={{ color: "var(--personalblog-accent)" }}
            >
              Featured
            </span>
          </div>
          <FeaturedPostCard post={featured} />
        </section>
      )}

      <section className="mb-20">
        <div className="flex items-center gap-3 mb-8">
          <span
            className="w-8 h-px"
            style={{ background: "var(--personalblog-accent)" }}
          />
          <span
            className="text-xs font-semibold uppercase tracking-[0.15em]"
            style={{ color: "var(--personalblog-accent)" }}
          >
            Latest
          </span>
        </div>
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
            {posts.map((post, i) => (
              <div
                key={post.id}
                className="personalblog-fade-in"
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
              style={{ color: "var(--personalblog-text-muted)" }}
            >
              No posts published yet. Check back soon.
            </p>
          </div>
        )}
      </section>

      {trending.length > 0 && (
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <span
              className="w-8 h-px"
              style={{ background: "var(--personalblog-accent)" }}
            />
            <span
              className="text-xs font-semibold uppercase tracking-[0.15em]"
              style={{ color: "var(--personalblog-accent)" }}
            >
              Trending
            </span>
          </div>
          <div className="space-y-4">
            {trending.map((post, i) => (
              <Link
                key={post.id}
                href={`/posts/${post.slug}`}
                className="personalblog-card p-6 block group flex items-center gap-6"
              >
                <span
                  className="personalblog-heading text-3xl"
                  style={{ color: "var(--personalblog-accent)" }}
                >
                  {(i + 1).toString().padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <h3 className="personalblog-heading text-lg group-hover:text-[var(--personalblog-accent)] transition-colors">
                    {post.title}
                  </h3>
                  <p
                    className="text-sm mt-1"
                    style={{ color: "var(--personalblog-text-muted)" }}
                  >
                    {post.views} views &middot; {post.commentCount} comments
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {categories.length > 0 && (
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <span
              className="w-8 h-px"
              style={{ background: "var(--personalblog-accent)" }}
            />
            <span
              className="text-xs font-semibold uppercase tracking-[0.15em]"
              style={{ color: "var(--personalblog-accent)" }}
            >
              Categories
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="personalblog-card p-6 text-center group"
              >
                <span className="personalblog-heading text-lg block">
                  {cat.name}
                </span>
                <span
                  className="text-sm"
                  style={{ color: "var(--personalblog-text-muted)" }}
                >
                  {cat._count.posts} {cat._count.posts === 1 ? "post" : "posts"}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {popularTags.length > 0 && (
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <span
              className="w-8 h-px"
              style={{ background: "var(--personalblog-accent)" }}
            />
            <span
              className="text-xs font-semibold uppercase tracking-[0.15em]"
              style={{ color: "var(--personalblog-accent)" }}
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
                  border: "1px solid var(--personalblog-border)",
                  color: "var(--personalblog-text)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor =
                    "var(--personalblog-accent)";
                  e.currentTarget.style.background =
                    "var(--personalblog-accent-light)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor =
                    "var(--personalblog-border)";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                #{tag.name}
                <span
                  className="ml-2"
                  style={{ color: "var(--personalblog-text-muted)" }}
                >
                  {tag.postCount}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <hr className="personalblog-divider" />
    </main>
  );
}

function FeaturedPostCard({ post }: { post: HomePageProps["posts"][0] }) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      className="personalblog-card p-8 sm:p-10 block group"
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
        <div className="flex-1 min-w-0">
          <span
            className="text-xs font-semibold uppercase tracking-[0.15em]"
            style={{ color: "var(--personalblog-accent)" }}
          >
            {post.category?.name ?? "Uncategorized"}
          </span>
          <h3 className="personalblog-heading text-2xl sm:text-3xl mt-3 group-hover:text-[var(--personalblog-accent)] transition-colors">
            {post.title}
          </h3>
          {post.excerpt && (
            <p
              className="mt-3 line-clamp-2"
              style={{ color: "var(--personalblog-text-muted)" }}
            >
              {post.excerpt}
            </p>
          )}
          <div
            className="flex items-center gap-4 mt-5 text-sm"
            style={{ color: "var(--personalblog-text-muted)" }}
          >
            <span
              className="font-medium"
              style={{ color: "var(--personalblog-text)" }}
            >
              {post.author.username}
            </span>
            <span
              className="w-1 h-1 rounded-full"
              style={{ background: "var(--personalblog-text-muted)" }}
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
      className="personalblog-card p-6 block group"
    >
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {post.tags.slice(0, 2).map((tag) => (
          <span
            key={tag.slug}
            className="text-xs px-2.5 py-1 rounded-full"
            style={{
              background: "var(--personalblog-accent-light)",
              color: "var(--personalblog-accent)",
            }}
          >
            #{tag.name}
          </span>
        ))}
      </div>
      <h3 className="personalblog-heading text-lg group-hover:text-[var(--personalblog-accent)] transition-colors">
        {post.title}
      </h3>
      {post.excerpt && (
        <p
          className="text-sm mt-2 line-clamp-2"
          style={{ color: "var(--personalblog-text-muted)" }}
        >
          {post.excerpt}
        </p>
      )}
      <div
        className="flex items-center gap-4 mt-5 text-xs"
        style={{ color: "var(--personalblog-text-muted)" }}
      >
        <span
          className="font-medium"
          style={{ color: "var(--personalblog-text)" }}
        >
          {post.author.username}
        </span>
        <span
          className="w-1 h-1 rounded-full"
          style={{ background: "var(--personalblog-text-muted)" }}
        />
        <span>{post._count.comments} comments</span>
      </div>
    </Link>
  );
}
