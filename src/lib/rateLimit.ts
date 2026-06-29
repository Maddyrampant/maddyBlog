const store = new Map<string, { count: number; resetAt: number }>();

type RateLimitConfig = {
  windowMs: number;
  maxRequests: number;
};

const defaults: RateLimitConfig = {
  windowMs: 60_000,
  maxRequests: 30,
};

export function rateLimit(
  key: string,
  config: Partial<RateLimitConfig> = {}
): { allowed: boolean; remaining: number; resetAt: number } {
  const { windowMs, maxRequests } = { ...defaults, ...config };
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, resetAt: now + windowMs };
  }

  entry.count += 1;

  if (entry.count > maxRequests) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  return { allowed: true, remaining: maxRequests - entry.count, resetAt: entry.resetAt };
}

export function rateLimitMiddleware(
  key: string,
  config?: Partial<RateLimitConfig>
): Response | null {
  const result = rateLimit(key, config);

  if (!result.allowed) {
    return Response.json(
      { error: "Too many requests. Please try again later.", code: "RATE_LIMITED" },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((result.resetAt - Date.now()) / 1000)),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  return null;
}
