"use client";

import Link from "next/link";
import "../edupro/styles/theme.css";
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

export default function EduProHomePage({
  posts,
  featured,
  categories,
  trending,
  popularTags,
}: HomePageProps) {
  return (
    <main className="flex-1 mx-auto max-w-6xl w-full px-4 sm:px-6 py-10">
      <section className="mb-12">
        <ImageSlider />
      </section>

      <section className="mb-12">
        <div className="flex items-center gap-2 mb-5">
          <span
            className="w-1 h-5 rounded-full"
            style={{ background: "var(--edupro-accent)" }}
          />
          <h2
            className="text-sm font-semibold uppercase tracking-wider"
            style={{ color: "var(--edupro-text-muted)" }}
          >
            Topics to explore
          </h2>
        </div>
        <StoriesBar />
      </section>

      {featured && (
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span
              className="text-xs font-semibold uppercase tracking-[0.15em]"
              style={{ color: "var(--edupro-accent)" }}
            >
              Featured Course
            </span>
            <span
              className="flex-1 h-px"
              style={{ background: "var(--edupro-border)" }}
            />
          </div>
          <FeaturedCourseCard post={featured} />
        </section>
      )}

      <section className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <span
            className="text-xs font-semibold uppercase tracking-[0.15em]"
            style={{ color: "var(--edupro-accent)" }}
          >
            Latest Lessons
          </span>
          <span
            className="flex-1 h-px"
            style={{ background: "var(--edupro-border)" }}
          />
        </div>
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <div
                key={post.id}
                className="edupro-fade-in"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <CourseCard post={post} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p
              className="text-lg"
              style={{ color: "var(--edupro-text-muted)" }}
            >
              No lessons published yet. Start learning soon!
            </p>
          </div>
        )}
      </section>

      {categories.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span
              className="text-xs font-semibold uppercase tracking-[0.15em]"
              style={{ color: "var(--edupro-accent)" }}
            >
              Subjects
            </span>
            <span
              className="flex-1 h-px"
              style={{ background: "var(--edupro-border)" }}
            />
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="edupro-subject-badge inline-flex items-center gap-2"
              >
                {cat.name}
                <span
                  className="text-xs"
                  style={{ color: "var(--edupro-text-muted)" }}
                >
                  {cat._count.posts}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {trending.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span
              className="text-xs font-semibold uppercase tracking-[0.15em]"
              style={{ color: "var(--edupro-accent)" }}
            >
              Popular Courses
            </span>
            <span
              className="flex-1 h-px"
              style={{ background: "var(--edupro-border)" }}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trending.map((post, i) => (
              <Link
                key={post.id}
                href={`/posts/${post.slug}`}
                className="edupro-card p-6 block group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className="text-lg font-bold"
                    style={{ color: "var(--edupro-accent)" }}
                  >
                    #{i + 1}
                  </span>
                  <div
                    className="flex-1 h-1 rounded-full"
                    style={{ background: "var(--edupro-border)" }}
                  >
                    <div
                      className="h-1 rounded-full edupro-progress"
                      style={{
                        width: `${Math.max(20, 100 - i * 15)}%`,
                      }}
                    />
                  </div>
                </div>
                <h3
                  className="font-semibold group-hover"
                  style={{ color: "var(--edupro-accent)" }}
                >
                  {post.title}
                </h3>
                <p
                  className="text-sm mt-2"
                  style={{ color: "var(--edupro-text-muted)" }}
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
              className="text-xs font-semibold uppercase tracking-[0.15em]"
              style={{ color: "var(--edupro-accent)" }}
            >
              Skills
            </span>
            <span
              className="flex-1 h-px"
              style={{ background: "var(--edupro-border)" }}
            />
          </div>
          <div className="flex flex-wrap gap-3">
            {popularTags.map((tag) => (
              <Link
                key={tag.id}
                href={`/tags/${tag.slug}`}
                className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
                style={{
                  border: "1px solid var(--edupro-border)",
                  color: "var(--edupro-text)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--edupro-accent)";
                  e.currentTarget.style.background =
                    "var(--edupro-accent-light)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--edupro-border)";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                {tag.name}
                <span
                  className="ml-2"
                  style={{ color: "var(--edupro-text-muted)" }}
                >
                  {tag.postCount}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <hr className="edupro-divider" />
    </main>
  );
}

function FeaturedCourseCard({ post }: { post: HomePageProps["posts"][0] }) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      className="edupro-card edupro-course-card p-8 sm:p-10 block group"
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
        <div className="flex-1 min-w-0">
          <span
            className="edupro-subject-badge inline-block mb-4"
            style={{
              background: "var(--edupro-accent-light)",
              color: "var(--edupro-accent)",
            }}
          >
            {post.category?.name ?? "General"}
          </span>
          <h3
            className="text-2xl sm:text-3xl font-bold group-hover"
            style={{
              color: "var(--edupro-accent)",
              fontFamily: "var(--edupro-font-heading)",
            }}
          >
            {post.title}
          </h3>
          {post.excerpt && (
            <p
              className="mt-3 line-clamp-2"
              style={{ color: "var(--edupro-text-muted)" }}
            >
              {post.excerpt}
            </p>
          )}
          <div
            className="flex items-center gap-4 mt-5 text-sm"
            style={{ color: "var(--edupro-text-muted)" }}
          >
            <span
              className="font-medium"
              style={{ color: "var(--edupro-text)" }}
            >
              {post.author.username}
            </span>
            <span
              className="w-1 h-1 rounded-full"
              style={{ background: "var(--edupro-text-muted)" }}
            />
            <time>{new Date(post.createdAt).toLocaleDateString()}</time>
          </div>
        </div>
        <div
          className="hidden sm:flex items-center gap-2 text-sm font-medium shrink-0 px-4 py-2 rounded-lg"
          style={{
            background: "var(--edupro-accent)",
            color: "#fff",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
          Start Learning
        </div>
      </div>
    </Link>
  );
}

function CourseCard({ post }: { post: HomePageProps["posts"][0] }) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      className="edupro-card edupro-course-card p-5 block group"
    >
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {post.category && (
          <span
            className="edupro-subject-badge text-xs"
            style={{
              background: "var(--edupro-accent-light)",
              color: "var(--edupro-accent)",
            }}
          >
            {post.category.name}
          </span>
        )}
        {post.tags.slice(0, 1).map((tag) => (
          <span
            key={tag.slug}
            className="text-xs px-2 py-0.5 rounded"
            style={{
              background: "var(--edupro-accent-blue)",
              color: "#fff",
              opacity: 0.85,
            }}
          >
            {tag.name}
          </span>
        ))}
      </div>
      <h3
        className="font-semibold text-base group-hover"
        style={{
          color: "var(--edupro-text)",
          fontFamily: "var(--edupro-font-heading)",
        }}
      >
        {post.title}
      </h3>
      {post.excerpt && (
        <p
          className="text-sm mt-1.5 line-clamp-2"
          style={{ color: "var(--edupro-text-muted)" }}
        >
          {post.excerpt}
        </p>
      )}
      <div
        className="flex items-center justify-between mt-4 pt-3 text-xs"
        style={{
          borderTop: "1px solid var(--edupro-border)",
          color: "var(--edupro-text-muted)",
        }}
      >
        <span className="font-medium" style={{ color: "var(--edupro-text)" }}>
          {post.author.username}
        </span>
        <span>{post._count.comments} comments</span>
      </div>
    </Link>
  );
}
