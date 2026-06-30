import { TimeoutError } from "./TimeoutError";

export type { TimeoutError };

export type HookExecutionError = {
  id: string;
  hookName: string;
  error: Error;
  timedOut: boolean;
};

export type HookRegistration<TContext, TResult> = {
  id: string;
  handler: (context: TContext) => TResult | Promise<TResult>;
  priority?: number;
  timeoutMs?: number;
};

type InternalEntry = {
  id: string;
  hookName: string;
  handler: (context: unknown) => unknown | Promise<unknown>;
  priority: number;
  timeoutMs: number;
};

export function isTimeoutError(error: unknown): boolean {
  return error instanceof TimeoutError;
}

export async function runWithTimeout<T>(
  valueOrPromise: T | Promise<T>,
  timeoutMs: number,
): Promise<T> {
  const promise =
    valueOrPromise instanceof Promise
      ? valueOrPromise
      : Promise.resolve(valueOrPromise);
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(
        () => reject(new TimeoutError(`Timed out after ${timeoutMs}ms`)),
        timeoutMs,
      ),
    ),
  ]);
}

export class HookEngine {
  private handlers = new Map<string, InternalEntry[]>();

  register<TContext, TResult>(
    hookName: string,
    registration: HookRegistration<TContext, TResult>,
  ): () => void {
    const entry: InternalEntry = {
      id: registration.id,
      hookName,
      handler: registration.handler as (
        context: unknown,
      ) => unknown | Promise<unknown>,
      priority: registration.priority ?? 10,
      timeoutMs: registration.timeoutMs ?? 5_000,
    };

    let list = this.handlers.get(hookName);
    if (!list) {
      list = [];
      this.handlers.set(hookName, list);
    }
    list.push(entry);
    list.sort((a, b) => b.priority - a.priority);

    return () => {
      const idx = list.indexOf(entry);
      if (idx >= 0) {
        list.splice(idx, 1);
        if (list.length === 0) {
          this.handlers.delete(hookName);
        }
      }
    };
  }

  async execute<TContext, TResult>(
    hookName: string,
    context: TContext,
  ): Promise<{ results: TResult[]; errors: HookExecutionError[] }> {
    const list = this.handlers.get(hookName);
    if (!list || list.length === 0) {
      return { results: [], errors: [] };
    }

    const results: TResult[] = [];
    const errors: HookExecutionError[] = [];

    for (const entry of list) {
      try {
        const handlerResult = entry.handler(context);
        const value = await runWithTimeout(handlerResult, entry.timeoutMs);
        results.push(value as TResult);
      } catch (err) {
        errors.push({
          id: entry.id,
          hookName,
          error: err instanceof Error ? err : new Error(String(err)),
          timedOut: isTimeoutError(err),
        });
      }
    }

    return { results, errors };
  }

  clear(): void {
    this.handlers.clear();
  }
}

export const hookEngine = new HookEngine();
