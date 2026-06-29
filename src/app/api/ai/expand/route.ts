import { NextRequest } from "next/server";
import { aiService } from "@/lib/ai";
import {
  aiTextSchema,
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
    const { text, model } = aiTextSchema.parse(body);

    const result = await aiService.generateFromTemplate(
      "expand_paragraph",
      { content: text },
      { model, userId },
    );

    return Response.json({ text: result.text.trim(), usage: result.usage });
  } catch (error) {
    return handleAiError(error);
  }
}
