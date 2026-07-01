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

export default function EduProCommentList({ comments }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <p style={{ color: "var(--edupro-text-muted)" }}>
        No discussion yet. Start the conversation!
      </p>
    );
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
      className={depth > 0 ? "ml-6 pl-4" : ""}
      style={
        depth > 0
          ? { borderLeft: "2px solid var(--edupro-accent-light)" }
          : undefined
      }
    >
      <div className="edupro-card p-5">
        <div
          className="flex items-center gap-2 text-sm mb-2"
          style={{ color: "var(--edupro-text-muted)" }}
        >
          <span className="font-medium" style={{ color: "var(--edupro-text)" }}>
            {comment.author.username}
          </span>
          <span
            className="w-1 h-1 rounded-full"
            style={{ background: "var(--edupro-text-muted)" }}
          />
          <time>{new Date(comment.createdAt).toLocaleDateString()}</time>
        </div>
        <p>{comment.content}</p>
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
