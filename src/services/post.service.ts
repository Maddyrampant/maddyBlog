import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { createPostSchema, updatePostSchema, type CreatePostInput, type UpdatePostInput } from "@/validations/post";
import type { PostListItem, PostDetail } from "@/types";

const postInclude = {
  author: { select: { username: true } },
  category: { select: { name: true, slug: true } },
  tags: { include: { tag: { select: { name: true, slug: true } } } },
  _count: { select: { comments: true } },
};

function formatPost(post: Record<string, unknown>): PostListItem {
  return {
    id: post.id as string,
    title: post.title as string,
    slug: post.slug as string,
    excerpt: post.excerpt as string | null,
    coverImage: post.coverImage as string | null,
    status: post.status as string,
    createdAt: post.createdAt as Date,
    author: { username: (post.author as Record<string, unknown>).username as string },
    category: post.category ? { name: (post.category as Record<string, unknown>).name as string, slug: (post.category as Record<string, unknown>).slug as string } : null,
    tags: ((post.tags as Array<Record<string, unknown>>) || []).map((pt) => ({
      name: (pt.tag as Record<string, unknown>).name as string,
      slug: (pt.tag as Record<string, unknown>).slug as string,
    })),
    _count: { comments: ((post._count as Record<string, unknown>).comments as number) },
  };
}

export async function getPublishedPosts(page = 1, pageSize = 10): Promise<{ posts: PostListItem[]; total: number }> {
  const skip = (page - 1) * pageSize;

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: { status: "PUBLISHED" },
      include: postInclude,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.post.count({ where: { status: "PUBLISHED" } }),
  ]);

  return { posts: posts.map(formatPost), total };
}

export async function getPostBySlug(slug: string): Promise<PostDetail | null> {
  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      ...postInclude,
      comments: {
        where: { parentId: null },
        include: {
          author: { select: { username: true } },
          replies: {
            include: { author: { select: { username: true } } },
            orderBy: { createdAt: "asc" },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!post) return null;

  return {
    ...formatPost(post),
    content: post.content,
    updatedAt: post.updatedAt,
    publishedAt: post.publishedAt,
    comments: post.comments.map((c) => ({
      id: c.id,
      content: c.content,
      createdAt: c.createdAt,
      author: { username: c.author.username },
      replies: c.replies.map((r) => ({
        id: r.id,
        content: r.content,
        createdAt: r.createdAt,
        author: { username: r.author.username },
        replies: [],
      })),
    })),
  };
}

export async function createPost(input: CreatePostInput, authorId: string) {
  const data = createPostSchema.parse(input);

  const post = await prisma.post.create({
    data: {
      title: data.title,
      slug: slugify(data.title),
      content: data.content,
      excerpt: data.excerpt,
      coverImage: data.coverImage,
      status: data.status ?? "DRAFT",
      authorId,
      categoryId: data.categoryId,
      tags: data.tagIds
        ? { create: data.tagIds.map((tagId) => ({ tagId })) }
        : undefined,
    },
  });

  return post;
}

export async function updatePost(id: string, input: UpdatePostInput) {
  const data = updatePostSchema.parse(input);

  const post = await prisma.post.update({
    where: { id },
    data: {
      ...data,
      slug: data.title ? slugify(data.title) : undefined,
      tags: data.tagIds
        ? { deleteMany: {}, create: data.tagIds.map((tagId) => ({ tagId })) }
        : undefined,
    },
  });

  return post;
}

export async function deletePost(id: string) {
  await prisma.post.delete({ where: { id } });
}

export async function getPostsByCategory(slug: string, page = 1, pageSize = 10) {
  const skip = (page - 1) * pageSize;

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: { status: "PUBLISHED", category: { slug } },
      include: postInclude,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.post.count({ where: { status: "PUBLISHED", category: { slug } } }),
  ]);

  return { posts: posts.map(formatPost), total };
}

export async function getPostsByTag(slug: string, page = 1, pageSize = 10) {
  const skip = (page - 1) * pageSize;

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: { status: "PUBLISHED", tags: { some: { tag: { slug } } } },
      include: postInclude,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.post.count({ where: { status: "PUBLISHED", tags: { some: { tag: { slug } } } } }),
  ]);

  return { posts: posts.map(formatPost), total };
}

export async function searchPosts(query: string, page = 1, pageSize = 10) {
  const skip = (page - 1) * pageSize;

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: {
        status: "PUBLISHED",
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { content: { contains: query, mode: "insensitive" } },
        ],
      },
      include: postInclude,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.post.count({
      where: {
        status: "PUBLISHED",
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { content: { contains: query, mode: "insensitive" } },
        ],
      },
    }),
  ]);

  return { posts: posts.map(formatPost), total };
}
