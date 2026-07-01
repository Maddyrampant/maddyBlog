import { prisma } from "@/lib/prisma";
import { errorResponse } from "@/lib/errors";
import { sendEmail } from "@/lib/email/emailService";
import { generateResetToken, getResetExpiry } from "@/lib/email/resetToken";
import { rateLimitMiddleware } from "@/lib/rateLimit";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const limited = rateLimitMiddleware(`forgot:${ip}`, {
    windowMs: 60_000,
    maxRequests: 3,
  });
  if (limited) return limited;

  try {
    const { email } = await request.json();
    if (!email) {
      return Response.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return Response.json(
        { message: "If that email exists, a reset link has been sent." },
        { status: 200 },
      );
    }

    const resetToken = generateResetToken();
    const resetTokenExpiry = getResetExpiry();

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpiry },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const resetUrl = `${appUrl}/reset-password?token=${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: "Password Reset — MaddyBlog",
      text: `Reset your password here: ${resetUrl}`,
      html: `<p>Click the link below to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>This link expires in 1 hour.</p>`,
    });

    return Response.json(
      { message: "If that email exists, a reset link has been sent." },
      { status: 200 },
    );
  } catch (error) {
    return errorResponse(error);
  }
}
