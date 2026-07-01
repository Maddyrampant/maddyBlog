import { getSession } from "@/lib/jwt";
import { AuthenticationError, AuthorizationError } from "@/lib/errors";
import { cacheStore } from "@/lib/cache/CacheStore";

export async function GET() {
  const session = await getSession();
  if (!session) throw new AuthenticationError();
  if (session.role !== "ADMIN") throw new AuthorizationError();

  return Response.json(cacheStore.getStats());
}
