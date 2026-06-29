type UsageRecord = {
  userId: string;
  tokensUsed: number;
  modelUsed: string;
  timestamp: Date;
  action: string;
};

type UserUsageSummary = {
  totalTokens: number;
  requestCount: number;
  cost: number;
};

const RATES: Record<string, number> = {
  "gpt-4o-mini": 0.00015,
  "gpt-4o": 0.0025,
  "text-embedding-3-small": 0.00002,
};

export class AICostTracker {
  private usage: Map<string, UsageRecord[]> = new Map();

  track(record: UsageRecord): void {
    const key = record.userId;
    const records = this.usage.get(key) ?? [];
    records.push(record);
    this.usage.set(key, records);
  }

  getUserSummary(userId: string, since?: Date): UserUsageSummary {
    const records = this.usage.get(userId) ?? [];
    const filtered = since
      ? records.filter((r) => r.timestamp >= since)
      : records;

    let totalTokens = 0;
    let requestCount = 0;
    let cost = 0;

    for (const r of filtered) {
      totalTokens += r.tokensUsed;
      requestCount++;
      const rate = RATES[r.modelUsed] ?? 0.00015;
      cost += (r.tokensUsed / 1000) * rate;
    }

    return { totalTokens, requestCount, cost };
  }

  getAllTimeCost(model: string): number {
    let totalTokens = 0;
    for (const records of this.usage.values()) {
      for (const r of records) {
        if (r.modelUsed === model) totalTokens += r.tokensUsed;
      }
    }
    const rate = RATES[model] ?? 0.00015;
    return (totalTokens / 1000) * rate;
  }

  getRecentUsage(limit = 100): UsageRecord[] {
    const all: UsageRecord[] = [];
    for (const records of this.usage.values()) {
      all.push(...records);
    }
    return all
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }
}

export const globalCostTracker = new AICostTracker();
