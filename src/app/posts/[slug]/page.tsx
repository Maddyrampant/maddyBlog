import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPostBySlug } from "@/services/blogService";
import { commentService } from "@/features/comment/commentService";
import { generatePostMetadata } from "@/lib/seo";
import StructuredData from "@/components/seo/StructuredData";
import PluginInjector from "@/components/plugin/PluginInjector";
import { ThemePageShell } from "@/components/layout/ThemePageShell";
import ThemeRenderer from "@/components/theme/ThemeRenderer";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const { slug } = await params;
    const post = await getPostBySlug(slug);
    if (!post) return {};
    return generatePostMetadata(post);
  } catch {
    return {};
  }
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let post, commentTree, commentCount;
  try {
    post = await getPostBySlug(slug);
    if (!post) notFound();
    [commentTree, commentCount] = await Promise.all([
      commentService.getCommentsTree(slug),
      commentService.getCount(slug),
    ]);
  } catch {
    notFound();
  }

  return (
    <>
      <StructuredData {...post} />
      <ThemePageShell>
        <ThemeRenderer
          component="PostPage"
          props={{ post, commentTree, commentCount }}
        />
        <PluginInjector extensionPoint="post:after:content" />
      </ThemePageShell>
    </>
  );
}
