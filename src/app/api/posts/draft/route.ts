import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/jwt";
import {
  errorResponse,
  AuthenticationError,
  ValidationError,
} from "@/lib/errors";
import { z } from "zod";

const draftSchema = z.object({
  postId: z.string().uuid().optional(),
  title: z.string().min(1, "Title is required").max(200),
  content: z.string(),
  excerpt: z.string().max(300).optional(),
  categoryId: z.string().uuid().optional().nullable(),
});

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session) throw new AuthenticationError();

    const body = await request.json();
    const parsed = draftSchema.safeParse(body);

    if (!parsed.success) {
      throw new ValidationError(parsed.error.issues[0].message);
    }

    const data = {
      title: parsed.data.title,
      content: parsed.data.content,
      excerpt: parsed.data.excerpt ?? null,
      categoryId: parsed.data.categoryId ?? null,
      status: "DRAFT" as const,
      authorId: session.userId,
    };

    if (parsed.data.postId) {
      const existing = await prisma.post.findUnique({
        where: { id: parsed.data.postId },
      });
      if (!existing) {
        return Response.json(
          { error: "Post not found", code: "NOT_FOUND" },
          { status: 404 },
        );
      }
      if (existing.authorId !== session.userId) {
        return Response.json(
          { error: "Not authorized", code: "AUTHORIZATION_ERROR" },
          { status: 403 },
        );
      }

      const post = await prisma.post.update({
        where: { id: parsed.data.postId },
        data: {
          title: data.title,
          content: data.content,
          excerpt: data.excerpt,
          categoryId: data.categoryId,
        },
      });

      return Response.json({ post, saved: true });
    }

    const slug =
      parsed.data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") +
      "-" +
      Date.now().toString(36);

    const post = await prisma.post.create({
      data: {
        ...data,
        slug,
      },
    });

    return Response.json({ post, saved: true }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
