import { NextRequest } from "next/server";
import { aiService } from "@/lib/ai";
import {
  aiContentSchema,
  requireAiAuth,
  checkAiRateLimit,
  handleAiError,
} from "../ai-helpers";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await requireAiAuth();
    const rateLimitResponse = checkAiRateLimit(userId);
    if (rateLimitResponse) return rateLimitResponse;

    const body = await request.json();
    const { content } = aiContentSchema.parse(body);

    const result = await aiService.moderate(content);

    return Response.json(result);
  } catch (error) {
    return handleAiError(error);
  }
}
