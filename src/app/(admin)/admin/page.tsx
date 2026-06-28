import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export default async function AdminDashboard() {
  await requireAdmin();

  const [postCount, commentCount, pendingComments] = await Promise.all([
    prisma.post.count(),
    prisma.comment.count(),
    prisma.comment.count({ where: { approved: false } }),
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        <div className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-lg">
          <p className="text-3xl font-bold">{postCount}</p>
          <p className="text-sm text-zinc-500">Posts</p>
        </div>
        <div className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-lg">
          <p className="text-3xl font-bold">{commentCount}</p>
          <p className="text-sm text-zinc-500">Comments</p>
        </div>
        <div className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-lg">
          <p className="text-3xl font-bold">{pendingComments}</p>
          <p className="text-sm text-zinc-500">Pending moderation</p>
        </div>
      </div>

      <div className="space-y-4">
        <Link
          href="/admin/posts"
          className="block p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900"
        >
          <h2 className="font-semibold">Manage Posts</h2>
          <p className="text-sm text-zinc-500">Create, edit, and publish posts</p>
        </Link>
        <Link
          href="/admin/comments"
          className="block p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900"
        >
          <h2 className="font-semibold">Moderate Comments</h2>
          <p className="text-sm text-zinc-500">Approve or delete comments</p>
        </Link>
      </div>
    </div>
  );
}
