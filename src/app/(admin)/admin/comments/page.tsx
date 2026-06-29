import { prisma } from "@/lib/prisma";
import DeleteCommentButton from "./DeleteCommentButton";

export default async function AdminCommentsPage() {
  const comments = await prisma.comment.findMany({
    include: {
      author: { select: { id: true, username: true, email: true } },
      post: { select: { id: true, title: true, slug: true } },
    },
    orderBy: { createdAt: "desc" },
  }) as unknown as Array<{
    id: string;
    content: string;
    createdAt: Date;
    author: { id: string; username: string | null; email: string };
    post: { id: string; title: string; slug: string };
  }>;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Comments</h1>
        <span className="text-sm text-zinc-500">{comments.length} total</span>
      </div>

      <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
        {comments.length === 0 ? (
          <p className="p-5 text-sm text-zinc-500">No comments yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-left">
                <th className="p-3 font-medium text-zinc-500">Author</th>
                <th className="p-3 font-medium text-zinc-500">Comment</th>
                <th className="p-3 font-medium text-zinc-500">On Post</th>
                <th className="p-3 font-medium text-zinc-500">Date</th>
                <th className="p-3 font-medium text-zinc-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {comments.map((comment) => (
                <tr key={comment.id} className="border-b border-zinc-200 dark:border-zinc-800 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                  <td className="p-3 font-medium">{comment.author.username ?? comment.author.email}</td>
                  <td className="p-3 text-zinc-700 dark:text-zinc-300 max-w-xs truncate">
                    {comment.content}
                  </td>
                  <td className="p-3">
                    <a href={`/posts/${comment.post.slug}`} className="text-blue-600 hover:underline">
                      {comment.post.title}
                    </a>
                  </td>
                  <td className="p-3 text-zinc-500 whitespace-nowrap">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <DeleteCommentButton id={comment.id} />
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
