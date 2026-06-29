import { createComment } from "@/features/comment/commentController";
import { getSession } from "@/lib/jwt";
import { commentService } from "@/features/comment/commentService";
import { errorResponse } from "@/lib/errors";
import { rateLimitMiddleware } from "@/lib/rateLimit";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const limited = rateLimitMiddleware(`comment:${ip}`, {
    windowMs: 60_000,
    maxRequests: 20,
  });
  if (limited) return limited;

  return createComment(request);
}

export async function DELETE(request: Request) {
  try {
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
  } catch (error) {
    return errorResponse(error);
  }
}
