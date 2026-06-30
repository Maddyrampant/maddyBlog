import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PostForm from "@/components/editor/PostForm";

type PostWithTags = {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  coverImage: string | null;
  slug: string;
  status: string;
  categoryId: string | null;
  tags: Array<{ tag: { id: string } }>;
};

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let post: PostWithTags | null = null;
  let categories: Array<{ id: string; name: string; slug: string }> = [];
  let tags: Array<{ id: string; name: string; slug: string }> = [];

  try {
    [post, categories, tags] = await Promise.all([
      prisma.post.findUnique({
        where: { id },
        include: {
          tags: { include: { tag: { select: { id: true } } } },
        },
      }) as unknown as Promise<PostWithTags | null>,
      prisma.category.findMany({ orderBy: { name: "asc" } }),
      prisma.tag.findMany({ orderBy: { name: "asc" } }),
    ]);
  } catch {
    // DB not available
  }

  if (!post) notFound();

  return (
    <div>
      <PostForm categories={categories} tags={tags} post={post} />
    </div>
  );
}
