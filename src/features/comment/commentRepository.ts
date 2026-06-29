import { prisma } from "@/lib/prisma";

export type CreateCommentData = {
  content: string;
  postId: string;
  authorId: string;
  parentId?: string | null;
};

export const commentRepository = {
  async create(data: CreateCommentData) {
    return prisma.comment.create({
      data: {
        content: data.content,
        postId: data.postId,
        authorId: data.authorId,
        parentId: data.parentId ?? null,
      },
      include: {
        author: { select: { id: true, username: true } },
      },
    });
  },

  async findByPostSlug(slug: string) {
    const post = await prisma.post.findUnique({ where: { slug }, select: { id: true } });
    if (!post) return [];
    return prisma.comment.findMany({
      where: { postId: post.id },
      include: {
        author: { select: { id: true, username: true } },
      },
      orderBy: { createdAt: "asc" },
    });
  },

  async findPending(page = 1, pageSize = 20) {
    const skip = (page - 1) * pageSize;
    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        include: {
          author: { select: { id: true, username: true, email: true } },
          post: { select: { id: true, title: true, slug: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.comment.count(),
    ]);
    return { comments, total };
  },

  async remove(id: string) {
    await prisma.comment.delete({ where: { id } });
  },

  async countByPostSlug(slug: string) {
    const post = await prisma.post.findUnique({ where: { slug }, select: { id: true } });
    if (!post) return 0;
    return prisma.comment.count({ where: { postId: post.id } });
  },
};
