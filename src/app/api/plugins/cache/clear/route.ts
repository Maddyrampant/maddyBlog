export async function POST() {
  const { cacheStore } = await import("@/lib/cache/CacheStore");
  cacheStore.clear();
  return Response.json({ success: true });
}
