import type {
  AIProvider,
  AIResponse,
  AIPromptOptions,
  StreamChunk,
  ModerationResult,
} from "../provider";

export class GeminiProvider implements AIProvider {
  readonly name = "gemini";
  private apiKey: string;
  private defaultModel: string;

  constructor(apiKey?: string, defaultModel = "gemini-1.5-flash") {
    this.apiKey = apiKey || process.env.GEMINI_API_KEY || "";
    this.defaultModel = defaultModel;
  }

  private getBaseUrl(model: string): string {
    return `https://generativelanguage.googleapis.com/v1beta/models/${model}`;
  }

  async generateText(
    prompt: string,
    options?: AIPromptOptions,
  ): Promise<AIResponse> {
    const model = options?.model ?? this.defaultModel;
    const url = `${this.getBaseUrl(model)}:generateContent?key=${this.apiKey}`;

    const contents: { role: string; parts: { text: string }[] }[] = [];
    if (options?.system) {
      contents.push({
        role: "user",
        parts: [{ text: `[System: ${options.system}]\n\n${prompt}` }],
      });
    } else {
      contents.push({ role: "user", parts: [{ text: prompt }] });
    }

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: options?.temperature ?? 0.7,
          maxOutputTokens: options?.maxTokens ?? 2048,
        },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Gemini API error: ${err}`);
    }

    const data = await res.json();
    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return {
      text,
      finishReason: data.candidates?.[0]?.finishReason === "STOP" ? "stop" : "length",
      usage: data.usageMetadata
        ? {
            promptTokens: data.usageMetadata.promptTokenCount || 0,
            completionTokens: data.usageMetadata.candidatesTokenCount || 0,
            totalTokens: data.usageMetadata.totalTokenCount || 0,
          }
        : undefined,
    };
  }

  generateStream(
    prompt: string,
    options?: AIPromptOptions,
  ): ReadableStream<StreamChunk> {
    const model = options?.model ?? this.defaultModel;
    const url = `${this.getBaseUrl(model)}:streamGenerateContent?alt=sse&key=${this.apiKey}`;

    return new ReadableStream<StreamChunk>({
      async start(controller) {
        try {
          const contents = [{ role: "user", parts: [{ text: prompt }] }];

          const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents,
              generationConfig: {
                temperature: options?.temperature ?? 0.7,
                maxOutputTokens: options?.maxTokens ?? 2048,
              },
            }),
          });

          if (!res.ok) {
            controller.enqueue({
              type: "error",
              content: `Gemini API error: ${res.status}`,
            });
            controller.close();
            return;
          }

          const reader = res.body?.getReader();
          if (!reader) {
            controller.enqueue({ type: "error", content: "No response body" });
            controller.close();
            return;
          }

          const decoder = new TextDecoder();
          let buffer = "";

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const json = line.slice(6).trim();
                if (!json || json === "[DONE]") continue;
                try {
                  const data = JSON.parse(json);
                  const text =
                    data.candidates?.[0]?.content?.parts?.[0]?.text;
                  if (text) {
                    controller.enqueue({ type: "text", content: text });
                  }
                } catch {
                  // skip malformed events
                }
              }
            }
          }

          controller.enqueue({ type: "done", content: "" });
          controller.close();
        } catch (err) {
          const message =
            err instanceof Error ? err.message : "Stream failed";
          controller.enqueue({ type: "error", content: message });
          controller.close();
        }
      },
    });
  }

  async embeddings(text: string): Promise<number[]> {
    const url = `${this.getBaseUrl("text-embedding-004")}:embedContent?key=${this.apiKey}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: { parts: [{ text }] } }),
    });
    const data = await res.json();
    return data.embedding?.values || [];
  }

  async moderate(text: string): Promise<ModerationResult> {
    return {
      flagged: false,
      categories: {},
      scores: {},
    };
  }
}
