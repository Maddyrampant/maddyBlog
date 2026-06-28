export type { SessionPayload } from "@/lib/auth";

export type PostListItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  published: boolean;
  createdAt: Date;
  author: { name: string | null; image: string | null };
  category: { name: string; slug: string } | null;
  tags: { name: string; slug: string }[];
  _count: { comments: number };
};

export type PostDetail = PostListItem & {
  content: string;
  updatedAt: Date;
  comments: CommentDetail[];
};

export type CommentDetail = {
  id: string;
  content: string;
  approved: boolean;
  createdAt: Date;
  author: { name: string | null; image: string | null };
  replies: CommentDetail[];
};
