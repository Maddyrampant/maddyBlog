import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/jwt";
import { NextRequest } from "next/server";

export async function GET() {
  try {
    const stories = await prisma.story.findMany({
      where: {
        active: true,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
      orderBy: { order: "asc" },
      include: {
        author: { select: { id: true, username: true, avatarUrl: true } },
      },
    });
    return Response.json(stories);
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to fetch stories" },
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
    const { action } = body;

    if (action === "create") {
      const { title, imageUrl, linkUrl, expiresAt } = body;
      if (!title || !imageUrl) {
        return Response.json({ error: "Title and imageUrl are required" }, { status: 400 });
      }
      const count = await prisma.story.count();
      const story = await prisma.story.create({
        data: { title, imageUrl, linkUrl, authorId: session.userId, order: count, expiresAt: expiresAt ? new Date(expiresAt) : null },
      });
      return Response.json(story, { status: 201 });
    }

    if (action === "delete") {
      const { id } = body;
      if (!id) return Response.json({ error: "id is required" }, { status: 400 });
      await prisma.story.delete({ where: { id } });
      return Response.json({ success: true });
    }

    if (action === "reorder") {
      const { orders } = body;
      if (!Array.isArray(orders)) {
        return Response.json({ error: "orders must be an array" }, { status: 400 });
      }
      await prisma.$transaction(
        orders.map((item: { id: string; order: number }) =>
          prisma.story.update({
            where: { id: item.id },
            data: { order: item.order },
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
