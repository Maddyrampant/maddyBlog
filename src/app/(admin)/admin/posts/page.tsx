import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteButton from "./DeleteButton";

export default async function AdminPostsPage() {
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
    createdAt: Date;
    author: { username: string | null };
    _count: { comments: number };
  }>;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Posts</h1>
        <span className="text-sm text-zinc-500">{posts.length} total</span>
      </div>

      <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
        {posts.length === 0 ? (
          <p className="p-5 text-sm text-zinc-500">No posts yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-left">
                <th className="p-3 font-medium text-zinc-500">Title</th>
                <th className="p-3 font-medium text-zinc-500">Author</th>
                <th className="p-3 font-medium text-zinc-500">Status</th>
                <th className="p-3 font-medium text-zinc-500">Comments</th>
                <th className="p-3 font-medium text-zinc-500">Date</th>
                <th className="p-3 font-medium text-zinc-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-zinc-200 dark:border-zinc-800 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                  <td className="p-3 font-medium max-w-xs truncate">{post.title}</td>
                  <td className="p-3 text-zinc-500">{post.author.username}</td>
                  <td className="p-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${post.status === "PUBLISHED" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"}`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="p-3 text-zinc-500">{post._count.comments}</td>
                  <td className="p-3 text-zinc-500">{new Date(post.createdAt).toLocaleDateString()}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/posts/${post.slug}`}
                        className="text-xs px-2.5 py-1 border border-zinc-300 dark:border-zinc-700 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                      >
                        View
                      </Link>
                      <DeleteButton id={post.id} title={post.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
