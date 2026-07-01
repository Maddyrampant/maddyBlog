import { getSession } from "@/lib/jwt";
import { AuthenticationError, AuthorizationError } from "@/lib/errors";

export async function POST() {
  const session = await getSession();
  if (!session) throw new AuthenticationError();
  if (session.role !== "ADMIN") throw new AuthorizationError();

  const { cacheStore } = await import("@/lib/cache/CacheStore");
  cacheStore.clear();
  return Response.json({ success: true });
}
