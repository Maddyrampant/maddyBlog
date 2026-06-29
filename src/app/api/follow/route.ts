import { NextRequest } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/jwt";
import {
  followUser,
  unfollowUser,
  isFollowing,
  getFollowCounts,
} from "@/services/socialService";
import {
  errorResponse,
  AuthenticationError,
  ValidationError,
} from "@/lib/errors";

const followSchema = z.object({
  userId: z.string().uuid(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) throw new AuthenticationError();

    const body = await request.json();
    const parsed = followSchema.safeParse(body);
    if (!parsed.success)
      throw new ValidationError(parsed.error.issues[0].message);

    await followUser(session.userId, parsed.data.userId);
    return Response.json({ following: true });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) throw new AuthenticationError();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) throw new ValidationError("userId is required");

    await unfollowUser(session.userId, userId);
    return Response.json({ following: false });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) throw new AuthenticationError();

    const { searchParams } = new URL(request.url);
    const targetId = searchParams.get("userId");

    if (!targetId) {
      const counts = await getFollowCounts(session.userId);
      return Response.json({ ...counts, following: false });
    }

    const [following, counts] = await Promise.all([
      isFollowing(session.userId, targetId),
      getFollowCounts(targetId),
    ]);

    return Response.json({ ...counts, following });
  } catch (error) {
    return errorResponse(error);
  }
}
