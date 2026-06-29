import CommentForm from "./CommentForm";

type CommentAuthor = { id: string; username: string };

type CommentNode = {
  id: string;
  content: string;
  createdAt: Date;
  author: CommentAuthor;
  parentId: string | null;
  replies: CommentNode[];
};

type CommentListProps = {
  comments: CommentNode[];
  postId: string;
};

function CommentItem({ comment, postId }: { comment: CommentNode; postId: string }) {
  const date = new Date(comment.createdAt).toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="border-l-2 border-zinc-200 dark:border-zinc-700 pl-4">
      <div className="mb-2">
        <span className="font-medium text-sm text-zinc-900 dark:text-zinc-100">
          {comment.author.username}
        </span>
        <span className="text-xs text-zinc-400 ml-3">{date}</span>
      </div>
      <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">{comment.content}</p>

      {comment.replies.length > 0 && (
        <div className="mt-4 space-y-4">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} postId={postId} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CommentList({ comments, postId }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <p className="text-zinc-500 text-sm">
        هنوز نظری ثبت نشده. اولین نفری باشید که نظر می‌دهید!
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} postId={postId} />
      ))}
    </div>
  );
}
