import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const [
    totalPosts,
    publishedPosts,
    draftPosts,
    totalComments,
    totalUsers,
  ] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { status: "PUBLISHED" } }),
    prisma.post.count({ where: { status: "DRAFT" } }),
    prisma.comment.count(),
    prisma.user.count(),
  ]);

  const stats = [
    { label: "Total Posts", value: totalPosts, sub: `${publishedPosts} published · ${draftPosts} drafts` },
    { label: "Comments", value: totalComments },
    { label: "Users", value: totalUsers },
  ];

  const recentPosts = await prisma.post.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { author: { select: { username: true } } },
  }) as unknown as Array<{ id: string; title: string; status: string; createdAt: Date; author: { username: string | null } }>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
        {stats.map((s) => (
          <div key={s.label} className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
            <p className="text-3xl font-bold">{s.value}</p>
            <p className="text-sm text-zinc-500 mt-1">{s.label}</p>
            {s.sub && <p className="text-xs text-zinc-400 mt-1">{s.sub}</p>}
          </div>
        ))}
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Posts</h2>
          <Link href="/admin/posts" className="text-sm text-blue-600 hover:underline">
            View all
          </Link>
        </div>
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
          {recentPosts.length === 0 ? (
            <p className="p-5 text-sm text-zinc-500">No posts yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-left">
                  <th className="p-3 font-medium text-zinc-500">Title</th>
                  <th className="p-3 font-medium text-zinc-500">Author</th>
                  <th className="p-3 font-medium text-zinc-500">Status</th>
                  <th className="p-3 font-medium text-zinc-500">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentPosts.map((post) => (
                  <tr key={post.id} className="border-b border-zinc-200 dark:border-zinc-800 last:border-0">
                    <td className="p-3 font-medium">{post.title}</td>
                    <td className="p-3 text-zinc-500">{post.author.username}</td>
                    <td className="p-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${post.status === "PUBLISHED" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"}`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="p-3 text-zinc-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}
