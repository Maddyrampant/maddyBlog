import { NextRequest } from "next/server";
import { seoAnalyzer } from "@/lib/ai";
import {
  aiSeoSchema,
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
    const { title, content, metaDescription } = aiSeoSchema.parse(body);

    const result = seoAnalyzer.analyze(title, content, metaDescription);

    return Response.json(result);
  } catch (error) {
    return handleAiError(error);
  }
}
