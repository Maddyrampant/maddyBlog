import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getPostsByTag } from "@/services/blogService";
import { generatePaginatedMetadata } from "@/lib/seo";
import PostList from "@/components/blog/PostList";
import Pagination from "@/components/blog/Pagination";

export const revalidate = 120;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const { slug } = await params;
    const tag = await prisma.tag.findUnique({ where: { slug } });
    if (!tag) return {};
    return generatePaginatedMetadata(`#${tag.name}`, `Browse all posts tagged with ${tag.name}.`);
  } catch {
    return {};
  }
}

export default async function TagPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const { page: pageStr } = await searchParams;
  const page = Number(pageStr) || 1;

  let tag, posts, total;
  try {
    tag = await prisma.tag.findUnique({ where: { slug } });
    if (!tag) notFound();
    const result = await getPostsByTag(slug, page, 12);
    posts = result.posts;
    total = result.total;
  } catch {
    notFound();
  }

  const totalPages = Math.ceil(total / 12);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-5 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">maddyBlog</Link>
          <nav className="flex gap-6 text-sm">
            <Link href="/" className="hover:text-zinc-600 dark:hover:text-zinc-400">Home</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 mx-auto max-w-6xl w-full px-4 sm:px-6 py-12">
        <section className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">#{tag.name}</h1>
          <p className="text-zinc-500">
            {total} post{total !== 1 ? "s" : ""} tagged with {tag.name}
          </p>
        </section>

        {posts.length > 0 ? (
          <>
            <PostList posts={posts} />
            <Pagination currentPage={page} totalPages={totalPages} basePath={`/tags/${slug}`} />
          </>
        ) : (
          <p className="text-zinc-500 py-12 text-center">No posts with this tag yet.</p>
        )}
      </main>
    </div>
  );
}
