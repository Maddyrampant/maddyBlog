export type AIPromptOptions = {
  system?: string;
  temperature?: number;
  maxTokens?: number;
  model?: string;
};

export type AIResponse = {
  text: string;
  finishReason: "stop" | "length" | "error";
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
};

export type StreamChunk = {
  type: "text" | "error" | "done";
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
};

export type ModerationResult = {
  flagged: boolean;
  categories: Record<string, boolean>;
  scores: Record<string, number>;
};

export interface AIProvider {
  generateText(prompt: string, options?: AIPromptOptions): Promise<AIResponse>;
  generateStream(
    prompt: string,
    options?: AIPromptOptions,
  ): ReadableStream<StreamChunk>;
  embeddings(text: string): Promise<number[]>;
  moderate(text: string): Promise<ModerationResult>;
  name: string;
}

export function isAIProvider(obj: unknown): obj is AIProvider {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "generateText" in obj &&
    "generateStream" in obj &&
    "embeddings" in obj &&
    "moderate" in obj
  );
}
