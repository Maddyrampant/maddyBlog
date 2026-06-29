import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { getSession } from "@/lib/jwt";
import { rateLimit } from "@/lib/rateLimit";
import {
  errorResponse,
  AuthenticationError,
  ValidationError,
} from "@/lib/errors";

const reactionTypeEnum = z.enum(["LIKE", "FIRE", "CLAP"]);

const createReactionSchema = z.object({
  postId: z.string().uuid(),
  type: reactionTypeEnum,
});

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) throw new AuthenticationError();

    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const rateLimitResult = rateLimit(`reactions:${ip}`, {
      windowMs: 60_000,
      maxRequests: 30,
    });
    if (!rateLimitResult.allowed) {
      return Response.json(
        {
          error: "Too many requests. Please try again later.",
          code: "RATE_LIMITED",
        },
        { status: 429 },
      );
    }

    const body = await request.json();
    const parsed = createReactionSchema.safeParse(body);

    if (!parsed.success) {
      throw new ValidationError(parsed.error.issues[0].message);
    }

    const existing = await prisma.reaction.findUnique({
      where: {
        userId_postId_type: {
          userId: session.userId,
          postId: parsed.data.postId,
          type: parsed.data.type,
        },
      },
    });

    if (existing) {
      await prisma.reaction.delete({ where: { id: existing.id } });
      return Response.json({ reacted: false, type: parsed.data.type });
    }

    await prisma.reaction.create({
      data: {
        userId: session.userId,
        postId: parsed.data.postId,
        type: parsed.data.type,
      },
    });

    return Response.json(
      { reacted: true, type: parsed.data.type },
      { status: 201 },
    );
  } catch (error) {
    return errorResponse(error);
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("postId");

    if (!postId) {
      throw new ValidationError("postId is required");
    }

    const reactions = await prisma.reaction.groupBy({
      by: ["type"],
      where: { postId },
      _count: true,
    });

    const counts = {
      LIKE: 0,
      FIRE: 0,
      CLAP: 0,
    } as Record<string, number>;

    for (const r of reactions) {
      counts[r.type] = r._count;
    }

    let userReactions: string[] = [];
    const session = await getSession();
    if (session) {
      const userReactionsData = await prisma.reaction.findMany({
        where: { postId, userId: session.userId },
        select: { type: true },
      });
      userReactions = userReactionsData.map((r) => r.type);
    }

    return Response.json({ counts, userReactions });
  } catch (error) {
    return errorResponse(error);
  }
}
