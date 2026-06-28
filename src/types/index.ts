export type { SessionPayload } from "@/lib/auth";

export type PostListItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  status: string;
  createdAt: Date;
  author: { username: string };
  category: { name: string; slug: string } | null;
  tags: { name: string; slug: string }[];
  _count: { comments: number };
};

export type PostDetail = PostListItem & {
  content: string;
  updatedAt: Date;
  publishedAt: Date | null;
  comments: CommentDetail[];
};

export type CommentDetail = {
  id: string;
  content: string;
  createdAt: Date;
  author: { username: string };
  replies: CommentDetail[];
};
