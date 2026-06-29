import { createComment } from "@/features/comment/commentController";
import { getSession } from "@/lib/jwt";
import { commentService } from "@/features/comment/commentService";

export async function POST(request: Request) {
  return createComment(request);
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return Response.json({ error: "Missing comment id" }, { status: 400 });
  }

  await commentService.delete(id);
  return Response.json({ success: true });
}
