import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

export const postRepository = {
  async create(data: Prisma.PostCreateInput) {
    return prisma.post.create({ data });
  },

  async findAllPublished(page = 1, pageSize = 10) {
    const skip = (page - 1) * pageSize;

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: { status: "PUBLISHED" },
        include: {
          author: { select: { id: true, username: true } },
          category: { select: { id: true, name: true, slug: true } },
          tags: {
            include: { tag: { select: { id: true, name: true, slug: true } } },
          },
          _count: { select: { comments: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.post.count({ where: { status: "PUBLISHED" } }),
    ]);

    return { posts, total };
  },

  async findBySlug(slug: string) {
    return prisma.post.findUnique({
      where: { slug },
      include: {
        author: { select: { id: true, username: true } },
        category: { select: { id: true, name: true, slug: true } },
        tags: {
          include: { tag: { select: { id: true, name: true, slug: true } } },
        },
        _count: { select: { comments: true } },
        comments: {
          where: { parentId: null },
          include: {
            author: { select: { id: true, username: true } },
            replies: {
              include: { author: { select: { id: true, username: true } } },
              orderBy: { createdAt: "asc" },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });
  },

  async findById(id: string) {
    return prisma.post.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, username: true } },
        category: { select: { id: true, name: true, slug: true } },
        tags: {
          include: { tag: { select: { id: true, name: true, slug: true } } },
        },
      },
    });
  },

  async update(id: string, data: Prisma.PostUpdateInput) {
    return prisma.post.update({ where: { id }, data });
  },

  async findAll(page = 1, pageSize = 50) {
    const skip = (page - 1) * pageSize;

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        include: {
          author: { select: { id: true, username: true } },
          category: { select: { id: true, name: true, slug: true } },
          tags: {
            include: { tag: { select: { id: true, name: true, slug: true } } },
          },
          _count: { select: { comments: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.post.count(),
    ]);

    return { posts, total };
  },

  async delete(id: string) {
    return prisma.post.delete({ where: { id } });
  },
};
