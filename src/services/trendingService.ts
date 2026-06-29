import { prisma } from "@/lib/prisma";

export type TrendingPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  score: number;
  views: number;
  commentCount: number;
  publishedAt: Date | null;
  author: { username: string };
};

export async function getTrendingPosts(limit = 5): Promise<TrendingPost[]> {
  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      coverImage: true,
      views: true,
      publishedAt: true,
      createdAt: true,
      author: { select: { username: true } },
      _count: { select: { comments: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const now = Date.now();
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

  const scored = posts.map((post) => {
    const views = post.views;
    const commentCount = post._count.comments;
    const ageMs = now - post.createdAt.getTime();
    const recencyBoost = Math.max(0, 1 - ageMs / sevenDaysMs);

    const score = views * 0.6 + commentCount * 0.4 + recencyBoost * 10;

    return {
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      coverImage: post.coverImage,
      score,
      views,
      commentCount,
      publishedAt: post.publishedAt,
      author: post.author,
    };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit);
}
