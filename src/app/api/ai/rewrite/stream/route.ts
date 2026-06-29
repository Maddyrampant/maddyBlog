import { NextRequest } from "next/server";
import { aiService } from "@/lib/ai";
import {
  requireAiAuth,
  checkAiRateLimit,
  handleAiError,
} from "../../ai-helpers";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await requireAiAuth();
    const rateLimitResponse = checkAiRateLimit(userId);
    if (rateLimitResponse) return rateLimitResponse;

    const body = await request.json();
    const { text, model, action = "rewrite_text" } = body;

    if (!text || typeof text !== "string" || text.length > 50000) {
      return Response.json({ error: "Invalid text content" }, { status: 400 });
    }

    const stream = aiService.generateStream(text, {
      system:
        "You are an expert editor. Rewrite the given text to be clearer, more engaging, and better structured while preserving the original meaning.",
      temperature: 0.6,
      maxTokens: 2048,
      model,
      userId,
      action,
    });

    const encoder = new TextEncoder();

    const responseStream = new ReadableStream({
      async start(controller) {
        const reader = stream.getReader();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const data = JSON.stringify(value);
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "error", content: "Stream error" })}\n\n`,
            ),
          );
          controller.close();
        }
      },
    });

    return new Response(responseStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    return handleAiError(error);
  }
}
