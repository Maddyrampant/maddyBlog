import { commentService } from "./commentService";
import { requireAuth } from "@/lib/jwt";

export async function createComment(request: Request) {
  const user = await requireAuth();
  if (!user) {
    return Response.json({ error: "برای ثبت نظر باید وارد شوید" }, { status: 401 });
  }
  const body = await request.json();
  const comment = await commentService.create(
    { content: body.content, postId: body.postId, parentId: body.parentId },
    user.userId
  );
  return Response.json({ comment }, { status: 201 });
}

export async function listCommentsByPost(slug: string) {
  const [comments, count] = await Promise.all([
    commentService.getCommentsTree(slug),
    commentService.getCount(slug),
  ]);
  return Response.json({ comments, count });
}
