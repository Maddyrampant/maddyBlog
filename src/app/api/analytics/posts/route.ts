import { getSession } from "@/lib/jwt";
import { getTopPosts } from "@/services/analyticsService";
import { errorResponse, AuthenticationError } from "@/lib/errors";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") throw new AuthenticationError();

    const posts = await getTopPosts(20);
    return Response.json({ posts });
  } catch (error) {
    return errorResponse(error);
  }
}
