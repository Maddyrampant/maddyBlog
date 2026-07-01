import { NextRequest } from "next/server";
import { postRepository } from "@/features/post/postRepository";
import { getSession } from "@/lib/jwt";
import { errorResponse } from "@/lib/errors";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await context.params;
    const post = await postRepository.findBySlug(slug);
    if (!post) {
      return Response.json({ error: "Post not found" }, { status: 404 });
    }
    return Response.json(post);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await context.params;
    const post = await postRepository.findBySlug(slug);
    if (!post) {
      return Response.json({ error: "Post not found" }, { status: 404 });
    }

    const body = await request.json();
    const data: Record<string, unknown> = {};
    if (body.title !== undefined) data.title = body.title;
    if (body.content !== undefined) data.content = body.content;
    if (body.excerpt !== undefined) data.excerpt = body.excerpt;
    if (body.coverImage !== undefined) data.coverImage = body.coverImage;
    if (body.categoryId !== undefined) data.categoryId = body.categoryId;
    if (body.status !== undefined) data.status = body.status;

    const updated = await postRepository.update(post.id, data);
    return Response.json(updated);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await context.params;
    const post = await postRepository.findBySlug(slug);
    if (!post) {
      return Response.json({ error: "Post not found" }, { status: 404 });
    }
    await postRepository.delete(post.id);
    return Response.json({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
