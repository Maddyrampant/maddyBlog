import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/jwt";

export async function GET() {
  const tags = await prisma.tag.findMany({
    include: { _count: { select: { posts: true } } },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(tags);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { name, slug } = await request.json();
    const tag = await prisma.tag.create({
      data: { name, slug },
    });
    return NextResponse.json(tag, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create tag" }, { status: 400 });
  }
}
