import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { rateLimit } from "@/lib/rateLimit";
import { errorResponse } from "@/lib/errors";

const subscribeSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const rateLimitResult = rateLimit(`newsletter:${ip}`, {
      windowMs: 60_000,
      maxRequests: 5,
    });
    if (!rateLimitResult.allowed) {
      return Response.json(
        {
          error: "Too many requests. Please try again later.",
          code: "RATE_LIMITED",
        },
        { status: 429 },
      );
    }

    const body = await request.json();
    const parsed = subscribeSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: parsed.error.issues[0].message, code: "VALIDATION_ERROR" },
        { status: 400 },
      );
    }

    const existing = await prisma.subscriber.findUnique({
      where: { email: parsed.data.email },
    });

    if (existing) {
      return Response.json(
        { message: "You are already subscribed!" },
        { status: 200 },
      );
    }

    await prisma.subscriber.create({
      data: { email: parsed.data.email },
    });

    return Response.json(
      { message: "Successfully subscribed to the newsletter!" },
      { status: 201 },
    );
  } catch (error) {
    return errorResponse(error);
  }
}
