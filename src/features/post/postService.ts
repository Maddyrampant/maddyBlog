import { prisma } from "@/lib/prisma";
import { generateSlug } from "@/lib/slug";
import { createPostSchema, updatePostSchema, type CreatePostInput, type UpdatePostInput } from "@/validations/postSchema";
import { postRepository } from "./postRepository";

export const postService = {
  async create(input: CreatePostInput, authorId: string) {
    const data = createPostSchema.parse(input);
    const slug = generateSlug(data.title);

    const post = await prisma.post.create({
      data: {
        title: data.title,
        slug,
        content: data.content,
        excerpt: data.excerpt,
        coverImage: data.coverImage,
        categoryId: data.categoryId,
        authorId,
        status: "DRAFT",
        tags: data.tags
          ? { create: data.tags.map((tagId) => ({ tagId })) }
          : undefined,
      },
      include: {
        author: { select: { id: true, username: true } },
        category: { select: { id: true, name: true, slug: true } },
        tags: { include: { tag: { select: { id: true, name: true, slug: true } } } },
      },
    });

    return post;
  },

  async update(postId: string, input: UpdatePostInput, userId: string) {
    const existing = await postRepository.findById(postId);
    if (!existing) throw new Error("Post not found");
    if (existing.authorId !== userId) throw new Error("Not authorized");

    const data = updatePostSchema.parse(input);

    const updateData: Record<string, unknown> = { ...data };
    if (data.title) {
      updateData.slug = generateSlug(data.title);
    }
    delete updateData.tags;

    const post = await prisma.post.update({
      where: { id: postId },
      data: {
        ...updateData,
        tags: data.tags
          ? { deleteMany: {}, create: data.tags.map((tagId) => ({ tagId })) }
          : undefined,
      },
    });

    return post;
  },

  async delete(postId: string, userId: string) {
    const existing = await postRepository.findById(postId);
    if (!existing) throw new Error("Post not found");
    if (existing.authorId !== userId) throw new Error("Not authorized");

    await postRepository.delete(postId);
  },

  async publish(postId: string) {
    const post = await postRepository.update(postId, {
      status: "PUBLISHED",
      publishedAt: new Date(),
    });
    return post;
  },

  async unpublish(postId: string) {
    const post = await postRepository.update(postId, {
      status: "DRAFT",
      publishedAt: null,
    });
    return post;
  },
};
