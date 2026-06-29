import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getPostBySlug } from "@/services/blogService";
import { commentService } from "@/features/comment/commentService";
import { generatePostMetadata } from "@/lib/seo";
import StructuredData from "@/components/seo/StructuredData";
import ReadingTime from "@/components/blog/ReadingTime";
import TagBadge from "@/components/blog/TagBadge";
import CategoryBadge from "@/components/blog/CategoryBadge";
import CommentForm from "@/components/blog/CommentForm";
import CommentList from "@/components/blog/CommentList";
import PluginInjector from "@/components/plugin/PluginInjector";

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
      <div className="min-h-screen flex flex-col">
        <header className="border-b border-zinc-200 dark:border-zinc-800">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 py-5 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold tracking-tight">
              maddyBlog
            </Link>
            <nav className="flex gap-6 text-sm">
              <Link
                href="/"
                className="hover:text-zinc-600 dark:hover:text-zinc-400"
              >
                Home
              </Link>
              <Link
                href="/admin"
                className="hover:text-zinc-600 dark:hover:text-zinc-400"
              >
                Admin
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1 mx-auto max-w-4xl w-full px-4 sm:px-6 py-12">
          <article>
            <header className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                {post.category && (
                  <CategoryBadge
                    name={post.category.name}
                    slug={post.category.slug}
                  />
                )}
                {post.tags.length > 0 &&
                  post.tags.map((tag) => (
                    <TagBadge key={tag.slug} name={tag.name} slug={tag.slug} />
                  ))}
              </div>

              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight mb-6">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-500 border-b border-zinc-200 dark:border-zinc-800 pb-6">
                <span className="font-medium text-zinc-700 dark:text-zinc-300">
                  {post.author.username}
                </span>
                <span>·</span>
                <time dateTime={post.createdAt.toISOString()}>
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
                <span>·</span>
                <ReadingTime minutes={post.readingTime} />
                {post._count.comments > 0 && (
                  <>
                    <span>·</span>
                    <span>{post._count.comments} comments</span>
                  </>
                )}
              </div>
            </header>

            {post.coverImage && (
              <div className="aspect-[2/1] overflow-hidden rounded-xl mb-10 bg-zinc-100 dark:bg-zinc-800 relative">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 896px"
                  priority
                />
              </div>
            )}

            <div
              className="prose prose-zinc dark:prose-invert prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-zinc-800 dark:prose-a:text-zinc-200 prose-img:rounded-xl"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>

          <PluginInjector hook="injectPostFooter" />

          <section className="mt-16 border-t border-zinc-200 dark:border-zinc-800 pt-12">
            <h2 className="text-2xl font-bold mb-2">نظرات ({commentCount})</h2>
            <p className="text-sm text-zinc-500 mb-8">
              دیدگاه خود را درباره این مطلب بنویسید.
            </p>

            <div className="mb-10">
              <CommentForm postId={post.id} />
            </div>

            <CommentList comments={commentTree} postId={post.id} />
          </section>
        </main>

        <footer className="border-t border-zinc-200 dark:border-zinc-800">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8 text-center text-sm text-zinc-500">
            &copy; {new Date().getFullYear()} maddyBlog. Published by{" "}
            {post.author.username}.
          </div>
        </footer>
      </div>
    </>
  );
}
