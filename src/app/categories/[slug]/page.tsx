import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getPostsByCategory } from "@/services/blogService";
import { generatePaginatedMetadata } from "@/lib/seo";
import PostList from "@/components/blog/PostList";
import Pagination from "@/components/blog/Pagination";
import { ThemePageShell } from "@/components/layout/ThemePageShell";

export const revalidate = 120;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const { slug } = await params;
    const category = await prisma.category.findUnique({ where: { slug } });
    if (!category) return {};
    return generatePaginatedMetadata(
      category.name,
      `Browse all posts in the ${category.name} category.`,
    );
  } catch {
    return {};
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const { page: pageStr } = await searchParams;
  const page = Number(pageStr) || 1;

  let category, posts, total;
  try {
    category = await prisma.category.findUnique({ where: { slug } });
    if (!category) notFound();
    const result = await getPostsByCategory(slug, page, 12);
    posts = result.posts;
    total = result.total;
  } catch {
    notFound();
  }

  const totalPages = Math.ceil(total / 12);

  return (
    <ThemePageShell>
      <main className="flex-1 mx-auto max-w-6xl w-full px-4 sm:px-6 py-12">
        <section className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
            {category.name}
          </h1>
          <p className="text-zinc-500">
            {total} post{total !== 1 ? "s" : ""} in this category
          </p>
        </section>

        {posts.length > 0 ? (
          <>
            <PostList posts={posts} />
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              basePath={`/categories/${slug}`}
            />
          </>
        ) : (
          <p className="text-zinc-500 py-12 text-center">
            No posts in this category yet.
          </p>
        )}
      </main>
    </ThemePageShell>
  );
}
