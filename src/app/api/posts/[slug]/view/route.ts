import { prisma } from "@/lib/prisma";
import { errorResponse, NotFoundError } from "@/lib/errors";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    const post = await prisma.post.findUnique({ where: { slug } });

    if (!post) throw new NotFoundError("Post not found");

    await prisma.post.update({
      where: { slug },
      data: { views: { increment: 1 } },
    });

    return Response.json({ views: post.views + 1 });
  } catch (error) {
    return errorResponse(error);
  }
}
