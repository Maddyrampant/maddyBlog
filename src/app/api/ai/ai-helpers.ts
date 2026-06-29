import { z } from "zod";
import { getSession } from "@/lib/jwt";
import { rateLimitMiddleware } from "@/lib/rateLimit";
import { errorResponse, AuthenticationError } from "@/lib/errors";

export const aiContentSchema = z.object({
  content: z.string().min(1).max(50000),
  model: z.string().optional(),
});

export const aiTextSchema = z.object({
  text: z.string().min(1).max(50000),
  model: z.string().optional(),
});

export const aiSeoSchema = z.object({
  title: z.string().max(200),
  content: z.string().max(100000),
  metaDescription: z.string().max(200).optional(),
});

export async function requireAiAuth(): Promise<{ userId: string }> {
  const session = await getSession();
  if (!session?.userId) throw new AuthenticationError();
  return { userId: session.userId };
}

export function checkAiRateLimit(userId: string): Response | null {
  return rateLimitMiddleware(`ai:${userId}`, {
    windowMs: 60_000,
    maxRequests: 20,
  });
}

export function handleAiError(error: unknown): Response {
  return errorResponse(error);
}
