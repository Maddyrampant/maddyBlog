import { prisma } from "@/lib/prisma";
import crypto from "node:crypto";

export async function recordView(
  postId: string,
  opts?: { ip?: string; userAgent?: string; referrer?: string },
) {
  const visitorHash = crypto
    .createHash("sha256")
    .update(opts?.ip || "unknown")
    .digest("hex")
    .slice(0, 16);

  await Promise.all([
    prisma.post.update({
      where: { id: postId },
      data: { views: { increment: 1 } },
    }),
    prisma.postView.create({
      data: {
        postId,
        visitorHash,
        referrer: opts?.referrer || null,
        userAgent: opts?.userAgent || null,
      },
    }),
  ]);
}

export async function getAnalyticsOverview() {
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );

  const [totalViews, todayViews, totalPosts, totalComments, totalReactions] =
    await Promise.all([
      prisma.postView.count(),
      prisma.postView.count({
        where: { createdAt: { gte: startOfToday } },
      }),
      prisma.post.count({ where: { status: "PUBLISHED" } }),
      prisma.comment.count(),
      prisma.reaction.count(),
    ]);

  const visitors = await prisma.postView.findMany({
    select: { visitorHash: true },
    distinct: ["visitorHash"],
  });

  return {
    totalViews,
    todayViews,
    totalUniqueVisitors: visitors.length,
    totalPosts,
    totalComments,
    totalReactions,
  };
}

export async function getViewsChart(days = 7) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const views = await prisma.postView.findMany({
    where: { createdAt: { gte: since } },
    select: { createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  const chart: Record<string, number> = {};
  for (let i = 0; i < days; i++) {
    const d = new Date(since);
    d.setDate(d.getDate() + i);
    chart[d.toISOString().slice(0, 10)] = 0;
  }

  for (const v of views) {
    const key = v.createdAt.toISOString().slice(0, 10);
    if (chart[key] !== undefined) chart[key]++;
  }

  return Object.entries(chart).map(([date, count]) => ({ date, views: count }));
}

export async function getTrafficSources(limit = 5) {
  const views = await prisma.postView.findMany({
    where: { referrer: { not: null } },
    select: { referrer: true },
  });

  const sourceCount: Record<string, number> = {};
  for (const v of views) {
    const source = v.referrer ? new URL(v.referrer).hostname : "direct";
    sourceCount[source] = (sourceCount[source] || 0) + 1;
  }

  return Object.entries(sourceCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([source, count]) => ({ source, count }));
}

export async function getTopPosts(limit = 10) {
  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { views: "desc" },
    take: limit,
    select: {
      id: true,
      title: true,
      slug: true,
      views: true,
      publishedAt: true,
      author: { select: { username: true } },
      _count: { select: { comments: true, reactions: true } },
    },
  });

  return posts.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    views: p.views,
    comments: p._count.comments,
    reactions: p._count.reactions,
    publishedAt: p.publishedAt,
    author: p.author,
  }));
}
