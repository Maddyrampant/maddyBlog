import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  excerpt: z.string().max(500).optional(),
  coverImage: z.string().url().optional(),
  published: z.boolean().optional(),
  featured: z.boolean().optional(),
  categoryId: z.string().optional(),
  tagIds: z.array(z.string()).optional(),
});

export const updatePostSchema = createPostSchema.partial();

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
