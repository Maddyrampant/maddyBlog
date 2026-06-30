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

export default function ZoomgCommentList({ comments }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <p style={{ color: "var(--zoomg-text-muted)" }}>
        هنوز دیدگاهی ثبت نشده.
      </p>
    );
  }

  return (
    <div className="space-y-5">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} depth={0} />
      ))}
    </div>
  );
}

function CommentItem({ comment, depth }: { comment: Comment; depth: number }) {
  return (
    <div
      className={depth > 0 ? "mr-6 pr-4" : ""}
      style={depth > 0 ? { borderRight: "1px solid var(--zoomg-border)" } : undefined}
    >
      <div className="zoomg-card p-4">
        <div
          className="flex items-center gap-2 text-sm mb-2"
          style={{ color: "var(--zoomg-text-muted)" }}
        >
          <span className="font-medium" style={{ color: "var(--zoomg-text-primary)" }}>
            {comment.author.username}
          </span>
          <span
            className="w-1 h-1 rounded-full inline-block"
            style={{ background: "var(--zoomg-text-muted)" }}
          />
          <time>
            {new Date(comment.createdAt).toLocaleDateString("fa-IR")}
          </time>
        </div>
        <p style={{ color: "var(--zoomg-text-primary)" }}>{comment.content}</p>
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
