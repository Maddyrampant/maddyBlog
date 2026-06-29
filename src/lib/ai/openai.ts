import OpenAI from "openai";
import type {
  AIProvider,
  AIResponse,
  AIPromptOptions,
  StreamChunk,
  ModerationResult,
} from "./provider";

export class OpenAIProvider implements AIProvider {
  readonly name = "openai";
  private _client: OpenAI | null = null;
  private defaultModel: string;

  constructor(apiKey?: string, defaultModel = "gpt-4o-mini") {
    this.defaultModel = defaultModel;
    if (typeof window === "undefined") {
      const key = apiKey || process.env.OPENAI_API_KEY;
      if (key) {
        this._client = new OpenAI({ apiKey: key });
      }
    }
  }

  private get client(): OpenAI {
    if (!this._client) {
      const key = process.env.OPENAI_API_KEY;
      if (!key) throw new Error("OPENAI_API_KEY is not configured");
      this._client = new OpenAI({ apiKey: key });
    }
    return this._client;
  }

  async generateText(
    prompt: string,
    options?: AIPromptOptions,
  ): Promise<AIResponse> {
    const completion = await this.client.chat.completions.create({
      model: options?.model ?? this.defaultModel,
      messages: [
        ...(options?.system
          ? [{ role: "system" as const, content: options.system }]
          : []),
        { role: "user" as const, content: prompt },
      ],
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 2048,
    });

    const choice = completion.choices[0];
    return {
      text: choice?.message?.content ?? "",
      finishReason:
        (choice?.finish_reason as AIResponse["finishReason"]) ?? "error",
      usage: completion.usage
        ? {
            promptTokens: completion.usage.prompt_tokens,
            completionTokens: completion.usage.completion_tokens,
            totalTokens: completion.usage.total_tokens,
          }
        : undefined,
    };
  }

  generateStream(
    prompt: string,
    options?: AIPromptOptions,
  ): ReadableStream<StreamChunk> {
    const client = this.client;
    const model = options?.model ?? this.defaultModel;
    const system = options?.system;
    const temperature = options?.temperature ?? 0.7;
    const maxTokens = options?.maxTokens ?? 2048;

    return new ReadableStream<StreamChunk>({
      async start(controller) {
        try {
          const stream = await client.chat.completions.create({
            model,
            messages: [
              ...(system ? [{ role: "system" as const, content: system }] : []),
              { role: "user" as const, content: prompt },
            ],
            temperature,
            max_tokens: maxTokens,
            stream: true,
            stream_options: { include_usage: true },
          });

          for await (const chunk of stream) {
            const delta = chunk.choices?.[0]?.delta?.content;
            if (delta) {
              controller.enqueue({ type: "text", content: delta });
            }

            if (chunk.usage) {
              controller.enqueue({
                type: "done",
                content: "",
                usage: {
                  promptTokens: chunk.usage.prompt_tokens,
                  completionTokens: chunk.usage.completion_tokens,
                  totalTokens: chunk.usage.total_tokens,
                },
              });
            }
          }

          controller.close();
        } catch (err) {
          const message =
            err instanceof Error ? err.message : "Stream generation failed";
          controller.enqueue({ type: "error", content: message });
          controller.close();
        }
      },
    });
  }

  async embeddings(text: string): Promise<number[]> {
    const resp = await this.client.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });

    return resp.data[0].embedding;
  }

  async moderate(text: string): Promise<ModerationResult> {
    const resp = await this.client.moderations.create({ input: text });
    const result = resp.results[0];

    return {
      flagged: result.flagged,
      categories: result.categories as unknown as Record<string, boolean>,
      scores: result.category_scores as unknown as Record<string, number>,
    };
  }
}
