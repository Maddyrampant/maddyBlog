export interface CreatePostInput {
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  categoryId?: string;
  tags?: string[];
}

export type UpdatePostInput = Partial<CreatePostInput>;
