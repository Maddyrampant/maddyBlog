import Link from "next/link";
import { getPublishedPosts } from "@/services/post.service";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { posts } = await getPublishedPosts(1, 10);

  return (
    <div className="flex flex-col flex-1">
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-4xl px-4 py-6 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">
            maddyBlog
          </Link>
          <nav className="flex gap-6 text-sm">
            <Link href="/blog" className="hover:text-zinc-600 dark:hover:text-zinc-400">
              Blog
            </Link>
            <Link href="/admin" className="hover:text-zinc-600 dark:hover:text-zinc-400">
              Admin
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 mx-auto max-w-4xl w-full px-4 py-12">
        <section className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-2">maddyBlog</h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Thoughts on code, design, and building things.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Latest Posts</h2>
          <div className="space-y-8">
            {posts.map((post) => (
              <article key={post.id}>
                <Link href={`/blog/${post.slug}`} className="group block">
                  <h3 className="text-xl font-semibold group-hover:text-zinc-600 dark:group-hover:text-zinc-400 transition-colors">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="mt-1 text-zinc-600 dark:text-zinc-400 line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="mt-2 flex items-center gap-3 text-sm text-zinc-500">
                    <time>{new Date(post.createdAt).toLocaleDateString()}</time>
                    {post.category && (
                      <>
                        <span>·</span>
                        <span>{post.category.name}</span>
                      </>
                    )}
                    <span>·</span>
                    <span>{post._count.comments} comments</span>
                  </div>
                </Link>
              </article>
            ))}
          </div>

          {posts.length === 0 && (
            <p className="text-zinc-500">No posts yet. Check back soon!</p>
          )}
        </section>
      </main>

      <footer className="border-t border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-4xl px-4 py-6 text-sm text-zinc-500 text-center">
          &copy; {new Date().getFullYear()} maddyBlog. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
