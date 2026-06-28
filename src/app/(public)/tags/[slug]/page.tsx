import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getPostsByTag } from "@/services/post.service";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tag = await prisma.tag.findUnique({ where: { slug } });

  if (!tag) return {};

  return {
    title: `#${tag.name}`,
    description: `Browse all posts tagged with ${tag.name}`,
  };
}

export const dynamic = "force-dynamic";

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

  const tag = await prisma.tag.findUnique({ where: { slug } });
  if (!tag) notFound();

  const { posts, total } = await getPostsByTag(slug, page, 10);
  const totalPages = Math.ceil(total / 10);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">#{tag.name}</h1>
      <p className="text-zinc-500 mb-8">{total} post{total !== 1 ? "s" : ""}</p>

      <div className="space-y-8">
        {posts.map((post) => (
          <article key={post.id}>
            <Link href={`/blog/${post.slug}`} className="group block">
              <h2 className="text-xl font-semibold group-hover:text-zinc-600 dark:group-hover:text-zinc-400">
                {post.title}
              </h2>
              {post.excerpt && (
                <p className="mt-1 text-zinc-600 dark:text-zinc-400">{post.excerpt}</p>
              )}
              <div className="mt-2 text-sm text-zinc-500">
                <time>{new Date(post.createdAt).toLocaleDateString()}</time>
              </div>
            </Link>
          </article>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-12 flex justify-center gap-4">
          {page > 1 && (
            <Link
              href={`/tags/${slug}?page=${page - 1}`}
              className="px-4 py-2 border rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Previous
            </Link>
          )}
          {page < totalPages && (
            <Link
              href={`/tags/${slug}?page=${page + 1}`}
              className="px-4 py-2 border rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
