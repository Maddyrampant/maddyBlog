type Comment = {
  id: string;
  content: string;
  createdAt: Date;
  author: { username: string };
  replies: Comment[];
};

type CommentListProps = {
  comments: Comment[];
  postId: string;
};

export default function DefaultCommentList({ comments }: CommentListProps) {
  if (comments.length === 0) {
    return <p className="text-zinc-500">No comments yet.</p>;
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} depth={0} />
      ))}
    </div>
  );
}

function CommentItem({ comment, depth }: { comment: Comment; depth: number }) {
  return (
    <div
      className={`${depth > 0 ? "ml-6 border-l border-zinc-200 dark:border-zinc-800 pl-4" : ""}`}
    >
      <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
        <div className="flex items-center gap-2 text-sm text-zinc-500 mb-2">
          <span className="font-medium text-zinc-700 dark:text-zinc-300">
            {comment.author.username}
          </span>
          <span>·</span>
          <time>{new Date(comment.createdAt).toLocaleDateString()}</time>
        </div>
        <p className="text-zinc-700 dark:text-zinc-300">{comment.content}</p>
      </div>
      {comment.replies.length > 0 && (
        <div className="mt-4 space-y-4">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
