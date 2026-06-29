import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { getSession } from "@/lib/jwt";
import {
  errorResponse,
  AuthenticationError,
  ValidationError,
} from "@/lib/errors";

const createBookmarkSchema = z.object({
  postId: z.string().uuid(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) throw new AuthenticationError();

    const body = await request.json();
    const parsed = createBookmarkSchema.safeParse(body);

    if (!parsed.success) {
      throw new ValidationError(parsed.error.issues[0].message);
    }

    const existing = await prisma.bookmark.findUnique({
      where: {
        userId_postId: {
          userId: session.userId,
          postId: parsed.data.postId,
        },
      },
    });

    if (existing) {
      await prisma.bookmark.delete({ where: { id: existing.id } });
      return Response.json({ bookmarked: false });
    }

    await prisma.bookmark.create({
      data: {
        userId: session.userId,
        postId: parsed.data.postId,
      },
    });

    return Response.json({ bookmarked: true }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) throw new AuthenticationError();

    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("postId");

    if (!postId) {
      throw new ValidationError("postId is required");
    }

    const bookmark = await prisma.bookmark.findUnique({
      where: {
        userId_postId: {
          userId: session.userId,
          postId,
        },
      },
    });

    if (!bookmark) {
      return Response.json({ message: "Bookmark not found" }, { status: 404 });
    }

    await prisma.bookmark.delete({ where: { id: bookmark.id } });
    return Response.json({ bookmarked: false });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session) throw new AuthenticationError();

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: session.userId },
      include: {
        post: {
          select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            coverImage: true,
            publishedAt: true,
            author: { select: { username: true } },
            _count: { select: { comments: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return Response.json({ bookmarks });
  } catch (error) {
    return errorResponse(error);
  }
}
