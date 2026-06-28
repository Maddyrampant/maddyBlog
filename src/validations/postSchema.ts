import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(200, "Title must be at most 200 characters"),
  content: z.string().min(20, "Content must be at least 20 characters"),
  excerpt: z.string().max(300, "Excerpt must be at most 300 characters").optional(),
  coverImage: z.string().url("Invalid image URL").optional(),
  categoryId: z.string().uuid("Invalid category ID").optional(),
  tags: z.array(z.string().uuid()).optional(),
});

export const updatePostSchema = createPostSchema.partial();

export const publishPostSchema = z.object({
  status: z.enum(["DRAFT", "PUBLISHED"]),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
