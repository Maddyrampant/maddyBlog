import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export default async function AdminPostsPage() {
  await requireAdmin();

  const posts = await prisma.post.findMany({
    include: {
      author: { select: { username: true } },
      _count: { select: { comments: true } },
    },
    orderBy: { createdAt: "desc" },
  }) as unknown as Array<{
    id: string;
    title: string;
    slug: string;
    status: string;
    author: { username: string | null };
    _count: { comments: number };
  }>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Posts</h1>
      </div>

      <div className="space-y-2">
        {posts.map((post) => (
          <div
            key={post.id}
            className="flex items-center justify-between p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg"
          >
            <div>
              <h2 className="font-semibold">{post.title}</h2>
              <p className="text-sm text-zinc-500">
                {post.author.username} · {post._count.comments} comments
                {post.status === "DRAFT" && (
                  <span className="ml-2 text-yellow-600">Draft</span>
                )}
              </p>
            </div>
            <div className="flex gap-2 text-sm">
              <Link
                href={`/blog/${post.slug}`}
                className="px-3 py-1 border border-zinc-300 dark:border-zinc-700 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                View
              </Link>
            </div>
          </div>
        ))}

        {posts.length === 0 && (
          <p className="text-zinc-500">No posts yet.</p>
        )}
      </div>
    </div>
  );
}
