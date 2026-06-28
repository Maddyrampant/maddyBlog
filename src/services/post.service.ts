import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { createPostSchema, updatePostSchema, type CreatePostInput, type UpdatePostInput } from "@/validations/post";
import type { PostListItem, PostDetail } from "@/types";

const postInclude = {
  author: { select: { name: true, image: true } },
  category: { select: { name: true, slug: true } },
  tags: { select: { name: true, slug: true } },
  _count: { select: { comments: true } },
};

export async function getPublishedPosts(page = 1, pageSize = 10): Promise<{ posts: PostListItem[]; total: number }> {
  const skip = (page - 1) * pageSize;

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: { published: true },
      include: postInclude,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.post.count({ where: { published: true } }),
  ]);

  return { posts: posts as unknown as PostListItem[], total };
}

export async function getPostBySlug(slug: string): Promise<PostDetail | null> {
  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      ...postInclude,
      comments: {
        where: { approved: true, parentId: null },
        include: {
          author: { select: { name: true, image: true } },
          replies: {
            where: { approved: true },
            include: { author: { select: { name: true, image: true } } },
            orderBy: { createdAt: "asc" },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  return post as unknown as PostDetail | null;
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
      published: data.published ?? false,
      featured: data.featured ?? false,
      authorId,
      categoryId: data.categoryId,
      tags: data.tagIds
        ? { connect: data.tagIds.map((id) => ({ id })) }
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
        ? { set: data.tagIds.map((id) => ({ id })) }
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
      where: { published: true, category: { slug } },
      include: postInclude,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.post.count({ where: { published: true, category: { slug } } }),
  ]);

  return { posts: posts as unknown as PostListItem[], total };
}

export async function getPostsByTag(slug: string, page = 1, pageSize = 10) {
  const skip = (page - 1) * pageSize;

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: { published: true, tags: { some: { slug } } },
      include: postInclude,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.post.count({ where: { published: true, tags: { some: { slug } } } }),
  ]);

  return { posts: posts as unknown as PostListItem[], total };
}

export async function searchPosts(query: string, page = 1, pageSize = 10) {
  const skip = (page - 1) * pageSize;

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: {
        published: true,
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
        published: true,
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { content: { contains: query, mode: "insensitive" } },
        ],
      },
    }),
  ]);

  return { posts: posts as unknown as PostListItem[], total };
}
