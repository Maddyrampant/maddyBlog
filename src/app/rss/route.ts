import { getAllPublishedPostsForRSS } from "@/services/blogService";
import { generateRssFeed } from "@/lib/rss";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const posts = await getAllPublishedPostsForRSS();
    const feed = generateRssFeed(posts);

    return new Response(feed, {
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
      },
    });
  } catch {
    return new Response("Feed unavailable", { status: 503 });
  }
}
