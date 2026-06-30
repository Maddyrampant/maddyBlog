import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/jwt";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const subscribers = await prisma.subscriber.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(subscribers);
}
