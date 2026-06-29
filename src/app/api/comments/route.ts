import { createComment } from "@/features/comment/commentController";

export async function POST(request: Request) {
  return createComment(request);
}
