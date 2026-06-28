import { z } from "zod";

export const createCommentSchema = z.object({
  content: z.string().min(1).max(2000),
  postId: z.string(),
  parentId: z.string().optional(),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
