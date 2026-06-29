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
    const { content, model } = aiContentSchema.parse(body);

    const result = await aiService.generateFromTemplate(
      "generate_title",
      { content },
      { model, userId },
    );

    return Response.json({ title: result.text.trim(), usage: result.usage });
  } catch (error) {
    return handleAiError(error);
  }
}
