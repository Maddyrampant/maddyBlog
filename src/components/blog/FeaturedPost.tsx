import Link from "next/link";
import Image from "next/image";
import type { PostCardData } from "@/services/blogService";
import ReadingTime from "./ReadingTime";
import CategoryBadge from "./CategoryBadge";

export default function FeaturedPost({ post }: { post: PostCardData }) {
  return (
    <article className="group grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      {post.coverImage && (
        <Link
          href={`/posts/${post.slug}`}
          className="block aspect-[4/3] overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800 relative"
        >
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </Link>
      )}

      <div className="flex flex-col">
        {post.category && <CategoryBadge name={post.category.name} slug={post.category.slug} />}

        <Link href={`/posts/${post.slug}`}>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight mt-3 group-hover:text-zinc-600 dark:group-hover:text-zinc-400 transition-colors">
            {post.title}
          </h1>
        </Link>

        {post.excerpt && (
          <p className="mt-4 text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {post.excerpt}
          </p>
        )}

        <div className="flex items-center gap-3 mt-6 text-sm text-zinc-500">
          <span className="font-medium text-zinc-700 dark:text-zinc-300">{post.author.username}</span>
          <span>·</span>
          <time dateTime={post.createdAt.toISOString()}>
            {new Date(post.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </time>
          <span>·</span>
          <ReadingTime minutes={post.readingTime} />
        </div>
      </div>
    </article>
  );
}
