import Link from "next/link";
import type { Metadata } from "next";
import { searchPosts } from "@/services/blogService";
import PostCard from "@/components/blog/PostCard";
import SearchBar from "@/components/blog/SearchBar";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Search — maddyBlog",
  description: "Search posts on maddyBlog.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page: pageStr } = await searchParams;
  const query = q?.trim() || "";
  const page = Number(pageStr) || 1;

  let posts: Array<{ id: string; title: string; slug: string; excerpt: string | null; coverImage: string | null; createdAt: Date; readingTime: number; author: { username: string }; category: { name: string; slug: string } | null; tags: { name: string; slug: string }[]; _count: { comments: number } }> = [];
  let total = 0;

  if (query.length > 0) {
    const result = await searchPosts(query, page, 12);
    posts = result.posts;
    total = result.total;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-5 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">maddyBlog</Link>
          <SearchBar />
        </div>
      </header>

      <main className="flex-1 mx-auto max-w-4xl w-full px-4 sm:px-6 py-12">
        <section className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
            {query ? `Search results for "${query}"` : "Search"}
          </h1>
          {query && (
            <p className="text-zinc-500">
              {total} result{total !== 1 ? "s" : ""}
            </p>
          )}
        </section>

        {query && posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : query ? (
          <p className="text-zinc-500 py-12 text-center">
            No posts found for "{query}". Try a different search term.
          </p>
        ) : (
          <p className="text-zinc-500 py-12 text-center">
            Enter a search term to find posts.
          </p>
        )}

        {query && total > 12 && (
          <nav className="flex items-center justify-center gap-4 mt-16">
            {page > 1 && (
              <Link
                href={`/search?q=${encodeURIComponent(query)}&page=${page - 1}`}
                className="px-5 py-2.5 text-sm font-medium border border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                ← Previous
              </Link>
            )}
            <span className="text-sm text-zinc-500">Page {page}</span>
            {posts.length === 12 && (
              <Link
                href={`/search?q=${encodeURIComponent(query)}&page=${page + 1}`}
                className="px-5 py-2.5 text-sm font-medium border border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Next →
              </Link>
            )}
          </nav>
        )}
      </main>
    </div>
  );
}
