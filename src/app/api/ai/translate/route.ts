import { aiService } from "@/lib/ai/service";
import { getSession } from "@/lib/jwt";

const SUPPORTED_LANGUAGES = [
  "persian",
  "english",
  "spanish",
  "french",
  "german",
  "italian",
  "portuguese",
  "russian",
  "chinese",
  "japanese",
  "korean",
  "arabic",
  "turkish",
  "hindi",
] as const;

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { text, targetLanguage } = await request.json();

    if (!text || !targetLanguage) {
      return Response.json(
        { error: "text and targetLanguage are required" },
        { status: 400 },
      );
    }

    if (!SUPPORTED_LANGUAGES.includes(targetLanguage)) {
      return Response.json(
        {
          error: `Unsupported language. Supported: ${SUPPORTED_LANGUAGES.join(", ")}`,
        },
        { status: 400 },
      );
    }

    const result = await aiService.generateText(
      `Translate the following text to ${targetLanguage}. Return ONLY the translated text, no explanations.\n\n${text}`,
      {
        system: "You are a professional translator. Translate accurately and naturally.",
        temperature: 0.3,
        maxTokens: 4096,
        userId: session.userId,
        action: "translate",
      },
    );

    if (result.finishReason === "error" || !result.text) {
      return Response.json({ error: "Translation failed" }, { status: 500 });
    }

    return Response.json({ translatedText: result.text.trim() });
  } catch {
    return Response.json({ error: "Translation failed" }, { status: 500 });
  }
}
