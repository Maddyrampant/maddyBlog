import { prisma } from "@/lib/prisma";

type NotifType = "FOLLOW" | "COMMENT" | "REACTION" | "MENTION" | "PUBLISH";

export async function notify(
  type: NotifType,
  payload: {
    recipientId: string;
    actorId?: string;
    postId?: string;
    link?: string;
    message: string;
  },
) {
  return prisma.notification.create({
    data: {
      type,
      message: payload.message,
      userId: payload.recipientId,
      actorId: payload.actorId,
      postId: payload.postId,
      link: payload.link,
    },
  });
}

export async function notifyComment(
  postAuthorId: string,
  commentAuthorId: string,
  commentAuthorName: string,
  postId: string,
  postTitle: string,
) {
  if (postAuthorId === commentAuthorId) return;
  return notify("COMMENT", {
    recipientId: postAuthorId,
    actorId: commentAuthorId,
    postId,
    link: `/posts/${postId}`,
    message: `commented on "${postTitle.substring(0, 60)}"`,
  });
}

export async function notifyReaction(
  postAuthorId: string,
  reactorId: string,
  reactorName: string,
  postId: string,
  reactionType: string,
) {
  if (postAuthorId === reactorId) return;
  return notify("REACTION", {
    recipientId: postAuthorId,
    actorId: reactorId,
    postId,
    link: `/posts/${postId}`,
    message: `reacted with ${reactionType} on your post`,
  });
}

export async function notifyPublish(
  followerId: string,
  authorId: string,
  authorName: string,
  postId: string,
  postTitle: string,
) {
  return notify("PUBLISH", {
    recipientId: followerId,
    actorId: authorId,
    postId,
    link: `/posts/${postId}`,
    message: `published a new post: "${postTitle.substring(0, 60)}"`,
  });
}

export async function notifyMention(
  mentionedUserId: string,
  mentionerId: string,
  mentionerName: string,
  postId: string,
  postTitle: string,
) {
  if (mentionedUserId === mentionerId) return;
  return notify("MENTION", {
    recipientId: mentionedUserId,
    actorId: mentionerId,
    postId,
    link: `/posts/${postId}`,
    message: `mentioned you in a comment on "${postTitle.substring(0, 60)}"`,
  });
}

const MENTION_REGEX = /@(\w{3,20})/g;

export function parseMentions(text: string): string[] {
  const matches = text.match(MENTION_REGEX);
  if (!matches) return [];
  return [...new Set(matches.map((m) => m.slice(1)))];
}
