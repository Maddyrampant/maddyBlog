import { prisma } from "@/lib/prisma";

export type SearchResult = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  publishedAt: Date | null;
  author: { username: string };
};

export async function searchPosts(query: string, page = 1, pageSize = 10) {
  const skip = (page - 1) * pageSize;

  const searchQuery = query.trim().split(/\s+/).filter(Boolean).join(" & ");

  if (!searchQuery) {
    return { posts: [], total: 0 };
  }

  const [posts, total] = await Promise.all([
    prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(
      `SELECT
        p.id, p.title, p.slug, p.excerpt, p."coverImage", p."publishedAt",
        u.username AS author_username
      FROM "Post" p
      JOIN "User" u ON u.id = p."authorId"
      WHERE p.status = 'PUBLISHED'
        AND to_tsvector('english', p.title || ' ' || p.content || ' ' || COALESCE(p.excerpt, ''))
          @@ to_tsquery('english', $1)
      ORDER BY p."createdAt" DESC
      OFFSET $2
      LIMIT $3`,
      searchQuery,
      skip,
      pageSize,
    ),
    prisma.$queryRawUnsafe<Array<{ count: bigint }>>(
      `SELECT COUNT(*) as count
      FROM "Post" p
      WHERE p.status = 'PUBLISHED'
        AND to_tsvector('english', p.title || ' ' || p.content || ' ' || COALESCE(p.excerpt, ''))
          @@ to_tsquery('english', $1)`,
      searchQuery,
    ),
  ]);

  const postsMapped: SearchResult[] = posts.map((row) => ({
    id: row.id as string,
    title: row.title as string,
    slug: row.slug as string,
    excerpt: row.excerpt as string | null,
    coverImage: row.coverImage as string | null,
    publishedAt: row.publishedAt as Date | null,
    author: { username: row.author_username as string },
  }));

  const totalCount = total.length > 0 ? Number(total[0].count) : 0;

  return { posts: postsMapped, total: totalCount };
}
