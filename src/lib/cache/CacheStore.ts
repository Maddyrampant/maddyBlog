type CacheEntry<T = unknown> = {
  value: T;
  expiresAt: number;
  hits: number;
  createdAt: number;
};

type CacheStats = {
  size: number;
  hits: number;
  misses: number;
  entries: Array<{
    key: string;
    hits: number;
    age: number;
    ttl: number;
    expiresIn: number;
  }>;
};

const DEFAULT_TTL = 5 * 60 * 1000;

export class CacheStore {
  private store = new Map<string, CacheEntry>();
  private totalHits = 0;
  private totalMisses = 0;

  get<T = unknown>(key: string): T | undefined {
    const entry = this.store.get(key);
    if (!entry) {
      this.totalMisses++;
      return undefined;
    }
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      this.totalMisses++;
      return undefined;
    }
    entry.hits++;
    this.totalHits++;
    return entry.value as T;
  }

  set<T = unknown>(key: string, value: T, ttl = DEFAULT_TTL): void {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttl,
      hits: 0,
      createdAt: Date.now(),
    });
  }

  has(key: string): boolean {
    const entry = this.store.get(key);
    if (!entry) return false;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return false;
    }
    return true;
  }

  delete(key: string): boolean {
    return this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
    this.totalHits = 0;
    this.totalMisses = 0;
  }

  invalidateByPrefix(prefix: string): number {
    let count = 0;
    for (const key of this.store.keys()) {
      if (key.startsWith(prefix)) {
        this.store.delete(key);
        count++;
      }
    }
    return count;
  }

  getStats(): CacheStats {
    const now = Date.now();
    const entries = Array.from(this.store.entries())
      .filter(([, e]) => now <= e.expiresAt)
      .map(([key, e]) => ({
        key,
        hits: e.hits,
        age: now - e.createdAt,
        ttl: e.expiresAt - e.createdAt,
        expiresIn: e.expiresAt - now,
      }));

    return {
      size: entries.length,
      hits: this.totalHits,
      misses: this.totalMisses,
      entries,
    };
  }
}

export const cacheStore = new CacheStore();
