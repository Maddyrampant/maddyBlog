import { prisma } from "@/lib/prisma";

export async function incrementPostViews(postId: string): Promise<void> {
  await prisma.post.update({
    where: { id: postId },
    data: { views: { increment: 1 } },
  });
}

export async function getPostViews(postId: string): Promise<number> {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { views: true },
  });
  return post?.views ?? 0;
}

export async function getMostViewedPosts(limit = 5) {
  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { views: "desc" },
    take: limit,
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      coverImage: true,
      views: true,
      publishedAt: true,
      author: { select: { username: true } },
      _count: { select: { comments: true } },
    },
  });
  return posts;
}
