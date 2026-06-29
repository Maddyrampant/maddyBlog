import { prisma } from "@/lib/prisma";

export async function getPopularTags(limit = 10) {
  const tags = await prisma.tag.findMany({
    include: {
      _count: {
        select: { posts: { where: { post: { status: "PUBLISHED" } } } },
      },
    },
    orderBy: { posts: { _count: "desc" } },
    take: limit,
  });

  return tags.map((tag) => ({
    id: tag.id,
    name: tag.name,
    slug: tag.slug,
    postCount: tag._count.posts,
  }));
}
