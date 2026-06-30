import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/jwt";
import { NextRequest } from "next/server";

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      where: { isFeatured: true, status: "PUBLISHED" },
      orderBy: { featuredOrder: "asc" },
      include: {
        author: { select: { id: true, username: true } },
        category: { select: { name: true, slug: true } },
        _count: { select: { comments: true } },
      },
    });

    const slides = await prisma.slide.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
      include: {
        post: {
          select: { slug: true, title: true, coverImage: true },
        },
      },
    });

    return Response.json({ posts, slides });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to fetch featured" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { postId, action } = body;

    if (action === "add" || action === "remove") {
      const post = await prisma.post.findUnique({ where: { id: postId } });
      if (!post) return Response.json({ error: "Post not found" }, { status: 404 });

      if (action === "add") {
        const count = await prisma.post.count({ where: { isFeatured: true } });
        await prisma.post.update({
          where: { id: postId },
          data: { isFeatured: true, featuredOrder: count },
        });
      } else {
        await prisma.post.update({
          where: { id: postId },
          data: { isFeatured: false, featuredOrder: 0 },
        });
      }

      return Response.json({ success: true });
    }

    if (action === "reorder") {
      const { orders } = body;
      if (!Array.isArray(orders)) {
        return Response.json({ error: "orders must be an array" }, { status: 400 });
      }
      await prisma.$transaction(
        orders.map((item: { id: string; order: number }) =>
          prisma.post.update({
            where: { id: item.id },
            data: { featuredOrder: item.order },
          }),
        ),
      );
      return Response.json({ success: true });
    }

    return Response.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Failed" },
      { status: 500 },
    );
  }
}
