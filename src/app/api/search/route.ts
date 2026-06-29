import { NextRequest } from "next/server";
import { searchPosts } from "@/services/searchService";
import { errorResponse } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim() || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.min(
      50,
      Math.max(1, parseInt(searchParams.get("pageSize") || "10", 10)),
    );

    if (!query) {
      return Response.json({ posts: [], total: 0 });
    }

    const results = await searchPosts(query, page, pageSize);
    return Response.json(results);
  } catch (error) {
    return errorResponse(error);
  }
}
