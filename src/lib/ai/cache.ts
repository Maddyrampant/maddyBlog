type CacheEntry = {
  response: string;
  createdAt: number;
  ttl: number;
};

export class AICache {
  private store = new Map<string, CacheEntry>();
  private maxSize: number;

  constructor(maxSize = 500) {
    this.maxSize = maxSize;
  }

  private key(prefix: string, prompt: string, model: string): string {
    return `${prefix}:${model}:${this.hash(prompt)}`;
  }

  private hash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }

  get(prefix: string, prompt: string, model: string): string | null {
    const k = this.key(prefix, prompt, model);
    const entry = this.store.get(k);

    if (!entry) return null;
    if (Date.now() - entry.createdAt > entry.ttl) {
      this.store.delete(k);
      return null;
    }

    return entry.response;
  }

  set(
    prefix: string,
    prompt: string,
    model: string,
    response: string,
    ttl = 86_400_000,
  ): void {
    if (this.store.size >= this.maxSize) {
      const oldest = this.store.keys().next().value;
      if (oldest) this.store.delete(oldest);
    }

    const k = this.key(prefix, prompt, model);
    this.store.set(k, { response, createdAt: Date.now(), ttl });
  }

  invalidate(prefix: string): void {
    for (const [key] of this.store) {
      if (key.startsWith(prefix)) this.store.delete(key);
    }
  }

  clear(): void {
    this.store.clear();
  }

  get size(): number {
    return this.store.size;
  }
}

export const globalAICache = new AICache();
