import { prisma } from "@/lib/prisma";

export type PostCardData = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  createdAt: Date;
  readingTime: number;
  author: { username: string };
  category: { name: string; slug: string } | null;
  tags: { name: string; slug: string }[];
  _count: { comments: number };
};

export type PostPageData = PostCardData & {
  content: string;
  updatedAt: Date;
  publishedAt: Date | null;
};

function readingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

function mapPost(post: Record<string, unknown>): PostCardData {
  return {
    id: post.id as string,
    title: post.title as string,
    slug: post.slug as string,
    excerpt: post.excerpt as string | null,
    coverImage: post.coverImage as string | null,
    createdAt: post.createdAt as Date,
    readingTime: readingTime(post.content as string),
    author: { username: (post.author as Record<string, unknown>).username as string },
    category: post.category
      ? {
          name: (post.category as Record<string, unknown>).name as string,
          slug: (post.category as Record<string, unknown>).slug as string,
        }
      : null,
    tags: ((post.tags as Array<Record<string, unknown>>) || []).map((pt) => ({
      name: (pt.tag as Record<string, unknown>).name as string,
      slug: (pt.tag as Record<string, unknown>).slug as string,
    })),
    _count: { comments: ((post._count as Record<string, unknown>).comments as number) },
  };
}

const postInclude = {
  author: { select: { username: true } },
  category: { select: { name: true, slug: true } },
  tags: { include: { tag: { select: { name: true, slug: true } } } },
  _count: { select: { comments: true } },
} as const;

export async function getLatestPosts(page = 1, pageSize = 9) {
  const skip = (page - 1) * pageSize;

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: { status: "PUBLISHED" },
      include: postInclude,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.post.count({ where: { status: "PUBLISHED" } }),
  ]);

  return { posts: posts.map(mapPost), total };
}

export async function getPostBySlug(slug: string): Promise<PostPageData | null> {
  const post = await prisma.post.findUnique({
    where: { slug },
    include: postInclude,
  });

  if (!post) return null;

  return { ...mapPost(post), content: post.content, updatedAt: post.updatedAt, publishedAt: post.publishedAt };
}

export async function getPostsByCategory(slug: string, page = 1, pageSize = 10) {
  const skip = (page - 1) * pageSize;

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: { status: "PUBLISHED", category: { slug } },
      include: postInclude,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.post.count({ where: { status: "PUBLISHED", category: { slug } } }),
  ]);

  return { posts: posts.map(mapPost), total };
}

export async function getPostsByTag(slug: string, page = 1, pageSize = 10) {
  const skip = (page - 1) * pageSize;

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: { status: "PUBLISHED", tags: { some: { tag: { slug } } } },
      include: postInclude,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.post.count({ where: { status: "PUBLISHED", tags: { some: { tag: { slug } } } } }),
  ]);

  return { posts: posts.map(mapPost), total };
}

export async function searchPosts(query: string, page = 1, pageSize = 10) {
  const skip = (page - 1) * pageSize;

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: {
        status: "PUBLISHED",
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { content: { contains: query, mode: "insensitive" } },
        ],
      },
      include: postInclude,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.post.count({
      where: {
        status: "PUBLISHED",
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { content: { contains: query, mode: "insensitive" } },
        ],
      },
    }),
  ]);

  return { posts: posts.map(mapPost), total };
}

export async function getAllCategories() {
  return prisma.category.findMany({
    include: { _count: { select: { posts: { where: { status: "PUBLISHED" } } } } },
    orderBy: { name: "asc" },
  });
}

export async function getAllPublishedPostsForSitemap() {
  return prisma.post.findMany({
    where: { status: "PUBLISHED" },
    select: {
      slug: true,
      updatedAt: true,
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getAllPublishedPostsForRSS() {
  return prisma.post.findMany({
    where: { status: "PUBLISHED" },
    select: {
      title: true,
      slug: true,
      excerpt: true,
      publishedAt: true,
      createdAt: true,
      author: { select: { username: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}
