import { prisma } from "@/lib/prisma";

export async function followUser(followerId: string, followingId: string) {
  if (followerId === followingId) throw new Error("Cannot follow yourself");

  const existing = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId, followingId } },
  });

  if (existing) return existing;

  return prisma.$transaction(async (tx) => {
    const follow = await tx.follow.create({
      data: { followerId, followingId },
    });

    await tx.notification.create({
      data: {
        type: "FOLLOW",
        message: "started following you",
        userId: followingId,
        actorId: followerId,
      },
    });

    return follow;
  });
}

export async function unfollowUser(followerId: string, followingId: string) {
  const existing = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId, followingId } },
  });

  if (!existing) return;

  await prisma.follow.delete({
    where: { followerId_followingId: { followerId, followingId } },
  });
}

export async function isFollowing(followerId: string, followingId: string) {
  const follow = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId, followingId } },
  });
  return !!follow;
}

export async function getFollowers(userId: string, page = 1, pageSize = 20) {
  const skip = (page - 1) * pageSize;

  const [follows, total] = await Promise.all([
    prisma.follow.findMany({
      where: { followingId: userId },
      include: {
        follower: {
          select: { id: true, username: true, avatarUrl: true, bio: true },
        },
      },
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
    prisma.follow.count({ where: { followingId: userId } }),
  ]);

  return { followers: follows.map((f) => f.follower), total };
}

export async function getFollowing(userId: string, page = 1, pageSize = 20) {
  const skip = (page - 1) * pageSize;

  const [follows, total] = await Promise.all([
    prisma.follow.findMany({
      where: { followerId: userId },
      include: {
        following: {
          select: { id: true, username: true, avatarUrl: true, bio: true },
        },
      },
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
    prisma.follow.count({ where: { followerId: userId } }),
  ]);

  return { following: follows.map((f) => f.following), total };
}

export async function getFollowCounts(userId: string) {
  const [followers, following] = await Promise.all([
    prisma.follow.count({ where: { followingId: userId } }),
    prisma.follow.count({ where: { followerId: userId } }),
  ]);

  return { followers, following };
}
