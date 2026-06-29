import { prisma } from "@/lib/prisma";

export type CreateNotificationInput = {
  type: "FOLLOW" | "COMMENT" | "REACTION" | "MENTION" | "PUBLISH";
  message: string;
  userId: string;
  actorId?: string;
  postId?: string;
  link?: string;
};

export async function createNotification(input: CreateNotificationInput) {
  return prisma.notification.create({
    data: {
      type: input.type,
      message: input.message,
      userId: input.userId,
      actorId: input.actorId,
      postId: input.postId,
      link: input.link,
    },
  });
}

export async function getNotifications(
  userId: string,
  page = 1,
  pageSize = 20,
) {
  const skip = (page - 1) * pageSize;

  const [notifications, total, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where: { userId },
      include: {
        actor: { select: { id: true, username: true, avatarUrl: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.notification.count({ where: { userId } }),
    prisma.notification.count({ where: { userId, read: false } }),
  ]);

  return { notifications, total, unreadCount };
}

export async function markAsRead(notificationId: string, userId: string) {
  return prisma.notification.updateMany({
    where: { id: notificationId, userId },
    data: { read: true },
  });
}

export async function markAllAsRead(userId: string) {
  return prisma.notification.updateMany({
    where: { userId, read: false },
    data: { read: true },
  });
}

export async function getUnreadCount(userId: string) {
  return prisma.notification.count({ where: { userId, read: false } });
}
