import { prisma } from "@/lib/prisma";

export async function getFeed(userId: string, page = 1, pageSize = 20) {
  const skip = (page - 1) * pageSize;

  const following = await prisma.follow.findMany({
    where: { followerId: userId },
    select: { followingId: true },
  });
  const followingIds = following.map((f) => f.followingId);
  followingIds.push(userId);

  const [activities, total] = await Promise.all([
    prisma.activity.findMany({
      where: { userId: { in: followingIds } },
      include: {
        user: { select: { id: true, username: true, avatarUrl: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.activity.count({
      where: { userId: { in: followingIds } },
    }),
  ]);

  return { activities, total };
}

export async function createActivity(data: {
  type: "FOLLOW" | "PUBLISH_POST" | "COMMENT" | "REACTION";
  message: string;
  userId: string;
  link?: string;
}) {
  return prisma.activity.create({ data });
}

export async function logPostPublished(
  postId: string,
  authorId: string,
  title: string,
  slug: string,
) {
  return createActivity({
    type: "PUBLISH_POST",
    message: `published a new post: ${title}`,
    userId: authorId,
    link: `/posts/${slug}`,
  });
}

export async function logComment(
  postId: string,
  authorId: string,
  slug: string,
) {
  return createActivity({
    type: "COMMENT",
    message: "commented on a post",
    userId: authorId,
    link: `/posts/${slug}`,
  });
}

export async function logReaction(
  postId: string,
  userId: string,
  slug: string,
) {
  return createActivity({
    type: "REACTION",
    message: "reacted to a post",
    userId,
    link: `/posts/${slug}`,
  });
}

export async function logFollow(followerId: string) {
  return createActivity({
    type: "FOLLOW",
    message: "started following someone",
    userId: followerId,
  });
}
