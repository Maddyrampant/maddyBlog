import type { Metadata } from "next";
import Link from "next/link";
import { getLatestPosts, getAllCategories } from "@/services/blogService";
import { getTrendingPosts } from "@/services/trendingService";
import { getPopularTags } from "@/services/tagService";
import { generatePaginatedMetadata } from "@/lib/seo";
import FeaturedPost from "@/components/blog/FeaturedPost";
import PostList from "@/components/blog/PostList";
import SearchBar from "@/components/blog/SearchBar";

export const revalidate = 60;

export const metadata: Metadata = generatePaginatedMetadata(
  "maddyBlog",
  "Thoughts on code, design, and building things that matter.",
);

export default async function HomePage() {
  let posts: Awaited<ReturnType<typeof getLatestPosts>>["posts"] = [];
  let categories: Awaited<ReturnType<typeof getAllCategories>> = [];
  let trending: Awaited<ReturnType<typeof getTrendingPosts>> = [];
  let popularTags: Awaited<ReturnType<typeof getPopularTags>> = [];

  try {
    const [result, catResult, trendingResult, tagsResult] = await Promise.all([
      getLatestPosts(1, 9),
      getAllCategories(),
      getTrendingPosts(5),
      getPopularTags(10),
    ]);
    posts = result.posts;
    categories = catResult;
    trending = trendingResult;
    popularTags = tagsResult;
  } catch {
    // Database not available — render empty state
  }

  const [featured, ...rest] = posts;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-5 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">
            maddyBlog
          </Link>
          <div className="flex items-center gap-4">
            <SearchBar />
            <nav className="hidden sm:flex gap-6 text-sm">
              <Link
                href="/"
                className="hover:text-zinc-600 dark:hover:text-zinc-400"
              >
                Home
              </Link>
              <Link
                href="/admin"
                className="hover:text-zinc-600 dark:hover:text-zinc-400"
              >
                Admin
              </Link>
            </nav>
          </div>
        </div>
      </header>

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
            <FeaturedPost post={featured} />
          </section>
        )}

        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-6">
            Latest Posts
          </h2>
          {rest.length > 0 ? (
            <PostList posts={rest} />
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

      <footer className="border-t border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 flex items-center justify-between text-sm text-zinc-500">
          <span>
            &copy; {new Date().getFullYear()} maddyBlog. All rights reserved.
          </span>
          <Link
            href="/"
            className="hover:text-zinc-700 dark:hover:text-zinc-300"
          >
            maddyBlog
          </Link>
        </div>
      </footer>
    </div>
  );
}
