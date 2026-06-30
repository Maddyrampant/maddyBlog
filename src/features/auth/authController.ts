import { register, login } from "./authService";
import { errorResponse } from "@/lib/errors";
import { rateLimitMiddleware } from "@/lib/rateLimit";
import logger from "@/lib/logger";

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return request.headers.get("x-real-ip") || "unknown";
}

function validateOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const allowed = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (origin && !origin.startsWith(allowed)) return false;
  if (referer && !referer.startsWith(allowed)) return false;
  return true;
}

function sanitizeInput(value: string): string {
  return value.replace(/[<>&'"]/g, "").trim();
}

const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();

function checkBruteForce(ip: string): string | null {
  const now = Date.now();
  const entry = loginAttempts.get(ip);

  if (entry) {
    if (entry.count >= 5 && now - entry.lastAttempt < 300_000) {
      const retryAfter = Math.ceil(
        (300_000 - (now - entry.lastAttempt)) / 1000,
      );
      return `Too many attempts. Try again in ${retryAfter} seconds.`;
    }
    if (now - entry.lastAttempt > 300_000) {
      loginAttempts.set(ip, { count: 1, lastAttempt: now });
    } else {
      entry.count++;
      entry.lastAttempt = now;
    }
  } else {
    loginAttempts.set(ip, { count: 1, lastAttempt: now });
  }

  return null;
}

function clearBruteForce(ip: string): void {
  loginAttempts.delete(ip);
}

export async function handleRegister(request: Request) {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  if (!validateOrigin(request)) {
    return Response.json({ error: "Invalid request origin" }, { status: 403 });
  }

  const ip = getClientIp(request);
  const limited = rateLimitMiddleware(`register:${ip}`, {
    windowMs: 60_000,
    maxRequests: 5,
  });
  if (limited) return limited;

  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return Response.json({ error: "Invalid content type" }, { status: 415 });
  }

  try {
    const body = await request.json();
    if (body.email) body.email = sanitizeInput(body.email);
    if (body.username) body.username = sanitizeInput(body.username);
    const user = await register(body);
    logger.info({ userId: user.id }, "User registered");
    return Response.json(user, { status: 201 });
  } catch (error) {
    logger.warn({ ip, error: (error as Error).message }, "Registration failed");
    return errorResponse(error);
  }
}

export async function handleLogin(request: Request) {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  if (!validateOrigin(request)) {
    return Response.json({ error: "Invalid request origin" }, { status: 403 });
  }

  const ip = getClientIp(request);

  const bruteForceError = checkBruteForce(ip);
  if (bruteForceError) {
    logger.warn({ ip }, "Brute force blocked");
    return Response.json({ error: bruteForceError }, { status: 429 });
  }

  const limited = rateLimitMiddleware(`login:${ip}`, {
    windowMs: 60_000,
    maxRequests: 10,
  });
  if (limited) return limited;

  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return Response.json({ error: "Invalid content type" }, { status: 415 });
  }

  try {
    const body = await request.json();
    if (body.email) body.email = sanitizeInput(body.email);
    const user = await login(body);
    clearBruteForce(ip);
    logger.info({ userId: user.id }, "User logged in");
    return Response.json(user);
  } catch (error) {
    logger.warn({ ip, error: (error as Error).message }, "Login failed");
    return errorResponse(error);
  }
}
