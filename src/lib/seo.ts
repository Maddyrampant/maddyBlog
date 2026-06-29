import type { Metadata } from "next";

const SITE_NAME = "maddyBlog";
const SITE_DESCRIPTION = "Thoughts on code, design, and building things that matter.";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://maddyblog.vercel.app";

type PostMeta = {
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  author: { username: string };
};

export function generatePostMetadata(post: PostMeta): Metadata {
  const title = `${post.title} | ${SITE_NAME}`;
  const description = post.excerpt || SITE_DESCRIPTION;
  const url = `${SITE_URL}/posts/${post.slug}`;
  const image = post.coverImage;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description,
      type: "article",
      url,
      siteName: SITE_NAME,
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: [post.author.username],
      ...(image ? { images: [{ url: image, width: 1200, height: 630, alt: post.title }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export function generatePaginatedMetadata(title: string, description?: string): Metadata {
  return {
    title: `${title} | ${SITE_NAME}`,
    description: description || SITE_DESCRIPTION,
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description: description || SITE_DESCRIPTION,
      siteName: SITE_NAME,
      type: "website",
    },
  };
}

export { SITE_NAME, SITE_DESCRIPTION, SITE_URL };
