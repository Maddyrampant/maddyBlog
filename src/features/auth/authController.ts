import { register, login } from "./authService";
import { errorResponse } from "@/lib/errors";
import { rateLimitMiddleware } from "@/lib/rateLimit";
import logger from "@/lib/logger";

export async function handleRegister(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const limited = rateLimitMiddleware(`register:${ip}`, { windowMs: 60_000, maxRequests: 5 });
  if (limited) return limited;

  try {
    const body = await request.json();
    const user = await register(body);
    return Response.json(user, { status: 201 });
  } catch (error) {
    logger.warn({ error }, "Registration failed");
    return errorResponse(error);
  }
}

export async function handleLogin(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const limited = rateLimitMiddleware(`login:${ip}`, { windowMs: 60_000, maxRequests: 10 });
  if (limited) return limited;

  try {
    const body = await request.json();
    const user = await login(body);
    return Response.json(user);
  } catch (error) {
    logger.warn({ error }, "Login failed");
    return errorResponse(error);
  }
}
