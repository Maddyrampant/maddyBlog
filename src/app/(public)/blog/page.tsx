import Link from "next/link";
import { getPublishedPosts } from "@/services/post.service";

export const dynamic = "force-dynamic";

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageStr } = await searchParams;
  const page = Number(pageStr) || 1;
  const { posts, total } = await getPublishedPosts(page, 10);
  const totalPages = Math.ceil(total / 10);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Blog</h1>

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
              <div className="mt-2 flex items-center gap-3 text-sm text-zinc-500">
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
            </Link>
          </article>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-12 flex justify-center gap-4">
          {page > 1 && (
            <Link
              href={`/blog?page=${page - 1}`}
              className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Previous
            </Link>
          )}
          {page < totalPages && (
            <Link
              href={`/blog?page=${page + 1}`}
              className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
