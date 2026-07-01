import type {
  AIProvider,
  AIResponse,
  AIPromptOptions,
  StreamChunk,
  ModerationResult,
} from "../provider";

export class AnthropicProvider implements AIProvider {
  readonly name = "anthropic";
  private apiKey: string;
  private defaultModel: string;

  constructor(apiKey?: string, defaultModel = "claude-3-5-sonnet-20241022") {
    this.apiKey = apiKey || process.env.ANTHROPIC_API_KEY || "";
    this.defaultModel = defaultModel;
  }

  async generateText(
    prompt: string,
    options?: AIPromptOptions,
  ): Promise<AIResponse> {
    const model = options?.model ?? this.defaultModel;
    const system = options?.system;

    const messages: { role: string; content: string }[] = [
      { role: "user", content: prompt },
    ];

    const body: Record<string, unknown> = {
      model,
      max_tokens: options?.maxTokens ?? 2048,
      temperature: options?.temperature ?? 0.7,
      messages,
    };
    if (system) body.system = system;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Anthropic API error: ${err}`);
    }

    const data = await res.json();
    return {
      text: data.content?.[0]?.text || "",
      finishReason: data.stop_reason === "end_turn" ? "stop" : "length",
      usage: data.usage
        ? {
            promptTokens: data.usage.input_tokens || 0,
            completionTokens: data.usage.output_tokens || 0,
            totalTokens:
              (data.usage.input_tokens || 0) + (data.usage.output_tokens || 0),
          }
        : undefined,
    };
  }

  generateStream(
    prompt: string,
    options?: AIPromptOptions,
  ): ReadableStream<StreamChunk> {
    const model = options?.model ?? this.defaultModel;
    const system = options?.system;
    const temperature = options?.temperature ?? 0.7;
    const maxTokens = options?.maxTokens ?? 2048;
    const apiKey = this.apiKey;

    return new ReadableStream<StreamChunk>({
      async start(controller) {
        try {
          const messages: { role: string; content: string }[] = [
            { role: "user", content: prompt },
          ];
          const body: Record<string, unknown> = {
            model,
            max_tokens: maxTokens,
            temperature,
            messages,
            stream: true,
          };
          if (system) body.system = system;

          const res = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": apiKey,
              "anthropic-version": "2023-06-01",
            },
            body: JSON.stringify(body),
          });

          if (!res.ok) {
            controller.enqueue({
              type: "error",
              content: `Anthropic API error: ${res.status}`,
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
                if (json === "[DONE]") continue;
                try {
                  const event = JSON.parse(json);
                  if (event.type === "content_block_delta" && event.delta?.text) {
                    controller.enqueue({
                      type: "text",
                      content: event.delta.text,
                    });
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

  async embeddings(_text: string): Promise<number[]> {
    throw new Error("Anthropic does not support embeddings");
  }

  async moderate(text: string): Promise<ModerationResult> {
    const result = await this.generateText(
      `Does the following text contain hate speech, harassment, or harmful content? Answer only "YES" or "NO".\n\n${text}`,
      { model: this.defaultModel, temperature: 0, maxTokens: 10 },
    );
    return {
      flagged: result.text.trim().toUpperCase() === "YES",
      categories: { hateful: result.text.trim().toUpperCase() === "YES" },
      scores: {},
    };
  }
}
