"use client";

import { useState, useCallback, useRef } from "react";
import type { StreamChunk } from "@/lib/ai";

type UseAIStreamOptions = {
  onChunk?: (text: string) => void;
  onDone?: () => void;
  onError?: (error: string) => void;
};

export function useAIStream(options: UseAIStreamOptions = {}) {
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const streamAI = useCallback(
    async (url: string, body: Record<string, unknown>) => {
      setStreaming(true);
      setError(null);
      abortRef.current = new AbortController();

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          signal: abortRef.current.signal,
        });

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error ?? "AI request failed");
        }

        const contentType = response.headers.get("Content-Type") ?? "";

        if (contentType.includes("text/event-stream")) {
          const reader = response.body?.getReader();
          if (!reader) throw new Error("No response body");

          const decoder = new TextDecoder();
          let buffer = "";

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6).trim();
                if (data === "[DONE]") {
                  options.onDone?.();
                  continue;
                }
                try {
                  const chunk: StreamChunk = JSON.parse(data);
                  if (chunk.type === "text") {
                    options.onChunk?.(chunk.content);
                  } else if (chunk.type === "error") {
                    setError(chunk.content);
                    options.onError?.(chunk.content);
                  }
                } catch {
                  // skip malformed chunks
                }
              }
            }
          }

          options.onDone?.();
        } else {
          const result = await response.json();
          const text =
            result.translatedText ??
            result.text ??
            result.title ??
            result.summary ??
            JSON.stringify(result);
          options.onChunk?.(text);
          options.onDone?.();
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
        const message =
          err instanceof Error ? err.message : "AI request failed";
        setError(message);
        options.onError?.(message);
      } finally {
        setStreaming(false);
      }
    },
    [options],
  );

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    setStreaming(false);
  }, []);

  return { streamAI, streaming, error, cancel };
}
