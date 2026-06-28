import { prisma } from "@/lib/prisma";
import { createCommentSchema, type CreateCommentInput } from "@/validations/comment";

export async function createComment(input: CreateCommentInput, authorId: string) {
  const data = createCommentSchema.parse(input);

  const comment = await prisma.comment.create({
    data: {
      content: data.content,
      postId: data.postId,
      authorId,
      parentId: data.parentId,
    },
  });

  return comment;
}

export async function getAllComments(page = 1, pageSize = 20) {
  const skip = (page - 1) * pageSize;

  const [comments, total] = await Promise.all([
    prisma.comment.findMany({
      include: {
        author: { select: { username: true, email: true } },
        post: { select: { title: true, slug: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.comment.count(),
  ]);

  return { comments, total };
}

export async function deleteComment(id: string) {
  await prisma.comment.delete({ where: { id } });
}
