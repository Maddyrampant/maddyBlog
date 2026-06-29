import { getSession } from "@/lib/jwt";
import { getTrendingPosts } from "@/services/trendingService";
import { errorResponse, AuthenticationError } from "@/lib/errors";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") throw new AuthenticationError();

    const trending = await getTrendingPosts(10);
    return Response.json({ trending });
  } catch (error) {
    return errorResponse(error);
  }
}
