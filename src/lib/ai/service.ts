import { OpenAIProvider } from "./openai";
import { PromptTemplates } from "./prompts";
import { globalAICache } from "./cache";
import { globalCostTracker } from "./cost-tracker";
import { detectPromptInjection, sanitizePrompt } from "./moderation";
import type {
  AIProvider,
  AIResponse,
  StreamChunk,
  ModerationResult,
} from "./provider";

export class AIService {
  private provider: AIProvider;

  constructor(provider?: AIProvider) {
    this.provider = provider ?? new OpenAIProvider();
  }

  setProvider(provider: AIProvider): void {
    this.provider = provider;
  }

  getProvider(): AIProvider {
    return this.provider;
  }

  async generateText(
    prompt: string,
    options?: {
      system?: string;
      temperature?: number;
      maxTokens?: number;
      model?: string;
      cachePrefix?: string;
      userId?: string;
      action?: string;
    },
  ): Promise<AIResponse> {
    if (detectPromptInjection(prompt)) {
      return {
        text: "",
        finishReason: "error",
        usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
      };
    }

    const cleanPrompt = sanitizePrompt(prompt);
    const model = options?.model ?? "gpt-4o-mini";

    if (options?.cachePrefix) {
      const cached = globalAICache.get(options.cachePrefix, cleanPrompt, model);
      if (cached) {
        return {
          text: cached,
          finishReason: "stop",
          usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
        };
      }
    }

    const response = await this.provider.generateText(cleanPrompt, {
      system: options?.system,
      temperature: options?.temperature,
      maxTokens: options?.maxTokens,
      model,
    });

    if (options?.cachePrefix && response.text) {
      globalAICache.set(options.cachePrefix, cleanPrompt, model, response.text);
    }

    if (options?.userId && response.usage) {
      globalCostTracker.track({
        userId: options.userId,
        tokensUsed: response.usage.totalTokens,
        modelUsed: model,
        timestamp: new Date(),
        action: options?.action ?? "generateText",
      });
    }

    return response;
  }

  generateStream(
    prompt: string,
    options?: {
      system?: string;
      temperature?: number;
      maxTokens?: number;
      model?: string;
      userId?: string;
      action?: string;
    },
  ): ReadableStream<StreamChunk> {
    if (detectPromptInjection(prompt)) {
      return new ReadableStream<StreamChunk>({
        start(controller) {
          controller.enqueue({
            type: "error",
            content: "Prompt rejected: potential injection detected",
          });
          controller.close();
        },
      });
    }

    const cleanPrompt = sanitizePrompt(prompt);
    const model = options?.model ?? "gpt-4o-mini";

    const stream = this.provider.generateStream(cleanPrompt, {
      system: options?.system,
      temperature: options?.temperature,
      maxTokens: options?.maxTokens,
      model,
    });

    const userId = options?.userId;
    const action = options?.action;

    if (userId) {
      const reader = stream.getReader();
      return new ReadableStream<StreamChunk>({
        async start(controller) {
          let totalTokens = 0;
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              if (value.type === "done" && value.usage) {
                totalTokens = value.usage.totalTokens;
              }
              controller.enqueue(value);
            }
          } finally {
            reader.releaseLock();
            if (totalTokens > 0) {
              globalCostTracker.track({
                userId,
                tokensUsed: totalTokens,
                modelUsed: model,
                timestamp: new Date(),
                action: action ?? "generateStream",
              });
            }
            controller.close();
          }
        },
      });
    }

    return stream;
  }

  async generateFromTemplate(
    templateName: string,
    vars: Record<string, string>,
    options?: { model?: string; userId?: string },
  ): Promise<AIResponse> {
    const rendered = PromptTemplates.render(templateName, vars);
    if (!rendered) {
      return {
        text: "",
        finishReason: "error",
        usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
      };
    }

    return this.generateText(rendered.userPrompt, {
      system: rendered.system,
      temperature: PromptTemplates.get(templateName)?.temperature,
      maxTokens: PromptTemplates.get(templateName)?.maxTokens,
      cachePrefix: `template:${templateName}`,
      model: options?.model,
      userId: options?.userId,
      action: templateName,
    });
  }

  async moderate(text: string): Promise<ModerationResult> {
    return this.provider.moderate(text);
  }

  async embeddings(text: string): Promise<number[]> {
    return this.provider.embeddings(text);
  }
}

export const aiService = new AIService();
