import type {
  AIProvider,
  AIResponse,
  AIPromptOptions,
  StreamChunk,
  ModerationResult,
} from "../provider";

export class OllamaProvider implements AIProvider {
  readonly name = "ollama";
  private baseUrl: string;
  private defaultModel: string;

  constructor(baseUrl?: string, defaultModel = "llama3.2") {
    this.baseUrl = baseUrl || process.env.OLLAMA_BASE_URL || "http://localhost:11434";
    this.defaultModel = defaultModel;
  }

  async generateText(
    prompt: string,
    options?: AIPromptOptions,
  ): Promise<AIResponse> {
    const model = options?.model ?? this.defaultModel;

    const res = await fetch(`${this.baseUrl}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        prompt: options?.system
          ? `${options.system}\n\n${prompt}`
          : prompt,
        options: {
          temperature: options?.temperature ?? 0.7,
          num_predict: options?.maxTokens ?? 2048,
        },
        stream: false,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Ollama API error: ${err}`);
    }

    const data = await res.json();
    return {
      text: data.response || "",
      finishReason: "stop",
      usage: {
        promptTokens: data.prompt_eval_count || 0,
        completionTokens: data.eval_count || 0,
        totalTokens: (data.prompt_eval_count || 0) + (data.eval_count || 0),
      },
    };
  }

  generateStream(
    prompt: string,
    options?: AIPromptOptions,
  ): ReadableStream<StreamChunk> {
    const model = options?.model ?? this.defaultModel;
    const baseUrl = this.baseUrl;

    return new ReadableStream<StreamChunk>({
      async start(controller) {
        try {
          const res = await fetch(`${baseUrl}/api/generate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              model,
              prompt: options?.system
                ? `${options.system}\n\n${prompt}`
                : prompt,
              options: {
                temperature: options?.temperature ?? 0.7,
                num_predict: options?.maxTokens ?? 2048,
              },
              stream: true,
            }),
          });

          if (!res.ok) {
            controller.enqueue({
              type: "error",
              content: `Ollama error: ${res.status}`,
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
              if (!line.trim()) continue;
              try {
                const data = JSON.parse(line);
                if (data.response) {
                  controller.enqueue({ type: "text", content: data.response });
                }
                if (data.done) {
                  controller.enqueue({ type: "done", content: "" });
                }
              } catch {
                // skip malformed lines
              }
            }
          }

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
    const res = await fetch(`${this.baseUrl}/api/embeddings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: this.defaultModel, prompt: text }),
    });
    const data = await res.json();
    return data.embedding || [];
  }

  async moderate(_text: string): Promise<ModerationResult> {
    return { flagged: false, categories: {}, scores: {} };
  }
}
