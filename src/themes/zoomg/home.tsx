"use client";

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

export default function ZoomgHomePage({
  posts,
  featured,
  categories,
  trending,
  popularTags,
  stories,
  slides,
}: HomePageProps) {
  return (
    <main className="flex-1" dir="rtl">
      <div
        className="mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10"
        style={{ maxWidth: "var(--zoomg-container-width)" }}
      >
        {stories && stories.length > 0 && (
          <section className="mb-8">
            <div className="zoomg-section-header">
              <h2 className="zoomg-section-title">داستان‌ها</h2>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-none">
              {stories.map((story) => (
                <Link
                  key={story.id}
                  href={story.linkUrl || "#"}
                  className="group shrink-0 text-center"
                >
                  <div
                    className="w-20 h-20 rounded-full overflow-hidden ring-2 transition-all duration-200 mx-auto"
                    style={{
                      border: "2px solid var(--zoomg-border)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--zoomg-accent)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--zoomg-border)";
                    }}
                  >
                    <img
                      src={story.imageUrl}
                      alt={story.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p
                    className="text-xs mt-2 truncate w-20"
                    style={{ color: "var(--zoomg-text-muted)" }}
                  >
                    {story.title}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {slides && slides.length > 0 && (
          <section className="mb-10">
            <FeaturedSlider slides={slides} />
          </section>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            {featured && (
              <section className="mb-10">
                <div className="zoomg-section-header">
                  <h2 className="zoomg-section-title">ویژه</h2>
                </div>
                <FeaturedPostCard post={featured} />
              </section>
            )}

            <section className="mb-10">
              <div className="zoomg-section-header">
                <h2 className="zoomg-section-title">آخرین مطالب</h2>
                {categories.length > 0 && (
                  <div className="hidden sm:flex items-center gap-2 zoomg-section-more">
                    {categories.slice(0, 5).map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/categories/${cat.slug}`}
                        className="transition-colors px-2 py-1 rounded"
                        style={{ color: "var(--zoomg-text-muted)" }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background =
                            "var(--zoomg-accent-light)";
                          e.currentTarget.style.color = "var(--zoomg-accent)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.color =
                            "var(--zoomg-text-muted)";
                        }}
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              {posts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p
                    className="text-base"
                    style={{ color: "var(--zoomg-text-muted)" }}
                  >
                    هنوز مطلبی منتشر نشده. به زودی بازگردید.
                  </p>
                </div>
              )}
            </section>

            {trending.length > 0 && (
              <section className="mb-10">
                <div className="zoomg-section-header">
                  <h2 className="zoomg-section-title">داغ ترین مطالب</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {trending.map((post, i) => (
                    <Link
                      key={post.id}
                      href={`/posts/${post.slug}`}
                      className="zoomg-card p-4 block group"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="text-2xl font-black tabular-nums"
                          style={{ color: "var(--zoomg-accent)" }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div className="min-w-0">
                          <h3
                            className="font-semibold text-sm group-hover transition-colors line-clamp-2"
                            style={{ color: "var(--zoomg-text-primary)" }}
                          >
                            {post.title}
                          </h3>
                          <p
                            className="text-xs mt-1"
                            style={{ color: "var(--zoomg-text-muted)" }}
                          >
                            {post.views} بازدید · {post.commentCount} دیدگاه
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {popularTags.length > 0 && (
              <section className="mb-10">
                <div className="zoomg-section-header">
                  <h2 className="zoomg-section-title">برچسب‌ها</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <Link
                      key={tag.slug}
                      href={`/tags/${tag.slug}`}
                      className="px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200"
                      style={{
                        border: "1px solid var(--zoomg-border)",
                        color: "var(--zoomg-text-muted)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor =
                          "var(--zoomg-accent)";
                        e.currentTarget.style.background =
                          "var(--zoomg-accent-light)";
                        e.currentTarget.style.color = "var(--zoomg-accent)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor =
                          "var(--zoomg-border)";
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "var(--zoomg-text-muted)";
                      }}
                    >
                      {tag.name}
                      <span className="mr-1.5 opacity-60">{tag.postCount}</span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {categories.length > 0 && (
              <section className="mb-10">
                <div className="zoomg-section-header">
                  <h2 className="zoomg-section-title">دسته‌بندی‌ها</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/categories/${cat.slug}`}
                      className="zoomg-card p-5 text-center group"
                      style={{ background: "var(--zoomg-bg-primary)" }}
                    >
                      <span
                        className="block text-base font-bold mb-1"
                        style={{ color: "var(--zoomg-text-primary)" }}
                      >
                        {cat.name}
                      </span>
                      <span
                        className="text-xs"
                        style={{ color: "var(--zoomg-text-muted)" }}
                      >
                        {cat._count.posts} مطلب
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            <hr className="zoomg-divider" />
          </div>
        </div>
      </div>
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
      className="zoomg-image-overlay block aspect-[21/9] max-h-[420px]"
    >
      {img && (
        <img
          src={img}
          alt={slide.title}
          className="w-full h-full object-cover"
        />
      )}
      <div className="zoomg-overlay-content">
        <div className="max-w-2xl">
          <span className="zoomg-badge mb-3 inline-block">ویژه</span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 leading-snug">
            {slide.title}
          </h2>
          {slide.subtitle && (
            <p className="text-sm sm:text-base text-white/80 line-clamp-2 max-w-xl">
              {slide.subtitle}
            </p>
          )}
        </div>
        <div className="mt-4">
          <span
            className="inline-block px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded"
            style={{ background: "var(--zoomg-accent)", color: "#fff" }}
          >
            ادامه مطلب
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
      className="zoomg-card p-5 sm:p-6 block group"
    >
      <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
        {post.coverImage && (
          <div className="w-full sm:w-48 h-32 shrink-0 rounded-lg overflow-hidden">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          {post.category && (
            <span
              className="text-xs font-bold uppercase tracking-wider inline-block mb-2"
              style={{ color: "var(--zoomg-accent)" }}
            >
              {post.category.name}
            </span>
          )}
          <h3
            className="text-lg sm:text-xl font-bold group-hover transition-colors leading-snug"
            style={{ color: "var(--zoomg-text-primary)" }}
          >
            {post.title}
          </h3>
          {post.excerpt && (
            <p
              className="mt-2 text-sm line-clamp-2 leading-relaxed"
              style={{ color: "var(--zoomg-text-muted)" }}
            >
              {post.excerpt}
            </p>
          )}
          <div
            className="flex items-center gap-3 mt-3 text-xs"
            style={{ color: "var(--zoomg-text-muted)" }}
          >
            <span
              className="font-medium"
              style={{ color: "var(--zoomg-text-primary)" }}
            >
              {post.author.username}
            </span>
            <span
              className="w-1 h-1 rounded-full inline-block"
              style={{ background: "var(--zoomg-text-muted)" }}
            />
            <time>
              {new Date(post.createdAt).toLocaleDateString("fa-IR", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </time>
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
      className="zoomg-card zoomg-card-hover block group overflow-hidden"
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
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: "var(--zoomg-accent)" }}
            >
              {post.category.name}
            </span>
          )}
        </div>
        <h3
          className="font-bold text-sm leading-snug group-hover transition-colors line-clamp-2"
          style={{ color: "var(--zoomg-text-primary)" }}
        >
          {post.title}
        </h3>
        {post.excerpt && (
          <p
            className="text-xs mt-1.5 line-clamp-2 leading-relaxed"
            style={{ color: "var(--zoomg-text-muted)" }}
          >
            {post.excerpt}
          </p>
        )}
        <div
          className="flex items-center gap-2 mt-3 text-xs"
          style={{ color: "var(--zoomg-text-muted)" }}
        >
          <span
            className="font-medium"
            style={{ color: "var(--zoomg-text-primary)" }}
          >
            {post.author.username}
          </span>
        </div>
      </div>
    </Link>
  );
}
