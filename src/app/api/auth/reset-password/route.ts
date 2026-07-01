import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/hash";
import { errorResponse } from "@/lib/errors";
import { isTokenExpired } from "@/lib/email/resetToken";

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();
    if (!token || !password) {
      return Response.json(
        { error: "Token and password are required" },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return Response.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findFirst({
      where: { resetToken: token },
    });

    if (!user || !user.resetTokenExpiry) {
      return Response.json(
        { error: "Invalid or expired reset token" },
        { status: 400 },
      );
    }

    if (isTokenExpired(user.resetTokenExpiry)) {
      return Response.json(
        { error: "Reset token has expired" },
        { status: 400 },
      );
    }

    const passwordHash = await hashPassword(password);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return Response.json({ message: "Password reset successful" });
  } catch (error) {
    return errorResponse(error);
  }
}
