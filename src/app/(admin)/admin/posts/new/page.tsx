import { prisma } from "@/lib/prisma";
import PostForm from "@/components/editor/PostForm";

export default async function NewPostPage() {
  let categories: Array<{ id: string; name: string; slug: string }> = [];
  let tags: Array<{ id: string; name: string; slug: string }> = [];

  try {
    [categories, tags] = await Promise.all([
      prisma.category.findMany({ orderBy: { name: "asc" } }),
      prisma.tag.findMany({ orderBy: { name: "asc" } }),
    ]);
  } catch {
    // DB not available
  }

  return (
    <div className="p-8">
      <PostForm categories={categories} tags={tags} />
    </div>
  );
}
