import { cacheStore } from "@/lib/cache/CacheStore";

export async function GET() {
  return Response.json(cacheStore.getStats());
}
