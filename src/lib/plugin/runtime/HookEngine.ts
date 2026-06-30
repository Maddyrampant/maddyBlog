type HandlerEntry<TContext, TResult = void> = {
  hook: string;
  pluginName: string;
  handler: (context: TContext) => TResult | Promise<TResult>;
  priority: number;
};

type HandlerMap = Map<string, HandlerEntry<unknown, unknown>[]>;

const DEFAULT_TIMEOUT = 5_000;

export class HookEngine {
  private handlers: HandlerMap = new Map();

  register<TContext, TResult = void>(
    hook: string,
    pluginName: string,
    handler: (context: TContext) => TResult | Promise<TResult>,
    options?: { priority?: number },
  ): void {
    if (!this.handlers.has(hook)) {
      this.handlers.set(hook, []);
    }
    const list = this.handlers.get(hook)!;
    list.push({
      hook,
      pluginName,
      handler: handler as (context: unknown) => unknown | Promise<unknown>,
      priority: options?.priority ?? 10,
    });
    list.sort((a, b) => a.priority - b.priority);
  }

  unregisterAll(pluginName: string): void {
    for (const [hook, list] of this.handlers.entries()) {
      const filtered = list.filter((e) => e.pluginName !== pluginName);
      if (filtered.length === 0) {
        this.handlers.delete(hook);
      } else {
        this.handlers.set(hook, filtered);
      }
    }
  }

  async execute<T>(
    hook: string,
    context: T,
    options?: { timeout?: number },
  ): Promise<T> {
    const list = this.handlers.get(hook);
    if (!list || list.length === 0) return context;

    let result: unknown = context;
    for (const entry of list) {
      try {
        result = await withTimeout(
          entry.handler(result),
          options?.timeout ?? DEFAULT_TIMEOUT,
          entry.pluginName,
        );
      } catch (err) {
        console.warn(
          `[HookEngine] hook "${hook}" handler "${entry.pluginName}" failed:`,
          err,
        );
      }
    }
    return result as T;
  }

  async executeFirst<TResult>(
    hook: string,
    context: unknown,
    options?: { timeout?: number },
  ): Promise<TResult | null> {
    const list = this.handlers.get(hook);
    if (!list || list.length === 0) return null;

    const entry = list[0]!;
    try {
      const result = await withTimeout(
        entry.handler(context),
        options?.timeout ?? DEFAULT_TIMEOUT,
        entry.pluginName,
      );
      return result as TResult;
    } catch (err) {
      console.warn(
        `[HookEngine] executeFirst hook "${hook}" handler "${entry.pluginName}" failed:`,
        err,
      );
    }
    return null;
  }

  async executeParallel<TResult>(
    hook: string,
    context: unknown,
    options?: { timeout?: number },
  ): Promise<TResult[]> {
    const list = this.handlers.get(hook);
    if (!list || list.length === 0) return [];

    const promises = list.map(async (entry) => {
      try {
        return await withTimeout(
          entry.handler(context),
          options?.timeout ?? DEFAULT_TIMEOUT,
          entry.pluginName,
        );
      } catch (err) {
        console.warn(
          `[HookEngine] executeParallel hook "${hook}" handler "${entry.pluginName}" failed:`,
          err,
        );
        return null;
      }
    });

    const results = await Promise.all(promises);
    return results.filter((r): r is TResult => r !== null);
  }

  hasHook(hook: string): boolean {
    return (this.handlers.get(hook)?.length ?? 0) > 0;
  }

  getHandlerCount(hook: string): number {
    return this.handlers.get(hook)?.length ?? 0;
  }

  getRegisteredHooks(): string[] {
    return Array.from(this.handlers.keys());
  }

  clear(): void {
    this.handlers.clear();
  }
}

async function withTimeout<T>(
  valueOrPromise: Promise<T> | T,
  ms: number,
  pluginName: string,
): Promise<T> {
  if (ms <= 0) return valueOrPromise;

  const value = await Promise.race([
    valueOrPromise,
    new Promise<never>((_, reject) =>
      setTimeout(
        () =>
          reject(new Error(`Handler "${pluginName}" timed out after ${ms}ms`)),
        ms,
      ),
    ),
  ]);
  return value;
}

export const hookEngine = new HookEngine();
