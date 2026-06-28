import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export default async function AdminCommentsPage() {
  await requireAdmin();

  const comments = await prisma.comment.findMany({
    include: {
      author: { select: { name: true, email: true } },
      post: { select: { title: true, slug: true } },
    },
    orderBy: { createdAt: "desc" },
  }) as unknown as Array<{
    id: string;
    content: string;
    approved: boolean;
    createdAt: Date;
    author: { name: string | null; email: string };
    post: { title: string; slug: string };
  }>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Comments</h1>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-medium">{comment.author.name ?? comment.author.email}</p>
                <p className="text-sm text-zinc-500">
                  on <span className="font-medium">{comment.post.title}</span>
                </p>
              </div>
              {!comment.approved && (
                <span className="px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded">
                  Pending
                </span>
              )}
            </div>
            <p className="text-zinc-700 dark:text-zinc-300">{comment.content}</p>
            <p className="mt-2 text-xs text-zinc-500">
              {new Date(comment.createdAt).toLocaleString()}
            </p>
          </div>
        ))}

        {comments.length === 0 && (
          <p className="text-zinc-500">No comments yet.</p>
        )}
      </div>
    </div>
  );
}
