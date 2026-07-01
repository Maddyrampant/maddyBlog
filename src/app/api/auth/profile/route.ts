import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/jwt";
import { errorResponse } from "@/lib/errors";

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { username, bio, website } = await request.json();

    const data: Record<string, string> = {};
    if (username !== undefined) data.username = username;
    if (bio !== undefined) data.bio = bio;
    if (website !== undefined) data.website = website;

    if (data.username) {
      const existing = await prisma.user.findUnique({ where: { username: data.username } });
      if (existing && existing.id !== session.userId) {
        return NextResponse.json({ error: "Username already taken" }, { status: 400 });
      }
    }

    const user = await prisma.user.update({
      where: { id: session.userId },
      data,
      select: { id: true, username: true, email: true, bio: true, website: true, role: true },
    });

    return NextResponse.json(user);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true, username: true, email: true, bio: true, website: true, role: true, createdAt: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    return errorResponse(error);
  }
}
