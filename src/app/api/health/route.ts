import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  let dbStatus: "healthy" | "unhealthy" = "healthy";

  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    dbStatus = "unhealthy";
  }

  const status = dbStatus === "healthy" ? "ok" : "degraded";
  const statusCode = dbStatus === "healthy" ? 200 : 503;

  return Response.json(
    {
      status,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: dbStatus,
    },
    { status: statusCode }
  );
}
