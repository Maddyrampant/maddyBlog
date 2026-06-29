import { commentRepository } from "./commentRepository";
import { createCommentSchema } from "@/validations/comment";
import type { Comment } from "@/generated/prisma/client";

export type CommentWithAuthor = Comment & {
  author: { id: string; username: string };
};

type CommentTreeNode = CommentWithAuthor & { replies: CommentTreeNode[] };

function buildCommentTree(comments: CommentWithAuthor[]): CommentTreeNode[] {
  const map = new Map<string, CommentTreeNode>();
  const roots: CommentTreeNode[] = [];

  for (const c of comments) {
    map.set(c.id, { ...c, replies: [] });
  }

  for (const c of comments) {
    const node = map.get(c.id)!;
    if (c.parentId && map.has(c.parentId)) {
      map.get(c.parentId)!.replies.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

export const commentService = {
  async create(input: { content: string; postId: string; parentId?: string }, authorId: string) {
    const data = createCommentSchema.parse(input);
    const comment = await commentRepository.create({
      content: data.content,
      postId: data.postId,
      authorId,
      parentId: data.parentId,
    });
    return comment;
  },

  async getCommentsTree(slug: string): Promise<CommentTreeNode[]> {
    const comments = await commentRepository.findByPostSlug(slug);
    return buildCommentTree(comments as CommentWithAuthor[]);
  },

  async getCount(slug: string) {
    return commentRepository.countByPostSlug(slug);
  },

  async delete(id: string) {
    return commentRepository.remove(id);
  },

  async listPending(page: number) {
    return commentRepository.findPending(page);
  },
};
