import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getPostBySlug } from "@/services/post.service";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt ?? undefined,
  };
}

export const dynamic = "force-dynamic";

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-4">{post.title}</h1>

        <div className="flex items-center gap-3 text-sm text-zinc-500 mb-4">
          <span>{post.author.name}</span>
          <span>·</span>
          <time>{new Date(post.createdAt).toLocaleDateString()}</time>
          {post.category && (
            <>
              <span>·</span>
              <Link
                href={`/categories/${post.category.slug}`}
                className="hover:text-zinc-700 dark:hover:text-zinc-300"
              >
                {post.category.name}
              </Link>
            </>
          )}
        </div>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link
                key={tag.slug}
                href={`/tags/${tag.slug}`}
                className="px-3 py-1 text-xs bg-zinc-100 dark:bg-zinc-800 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700"
              >
                {tag.name}
              </Link>
            ))}
          </div>
        )}
      </header>

      <div
        className="prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}
