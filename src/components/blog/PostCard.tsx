import Link from "next/link";
import type { PostCardData } from "@/services/blogService";
import ReadingTime from "./ReadingTime";
import CategoryBadge from "./CategoryBadge";

export default function PostCard({ post }: { post: PostCardData }) {
  return (
    <article className="group flex flex-col">
      {post.coverImage && (
        <Link href={`/posts/${post.slug}`} className="block aspect-[16/9] overflow-hidden rounded-lg mb-4 bg-zinc-100 dark:bg-zinc-800">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </Link>
      )}

      <div className="flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          {post.category && <CategoryBadge name={post.category.name} slug={post.category.slug} />}
          <time className="text-xs text-zinc-500" dateTime={post.createdAt.toISOString()}>
            {new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </time>
        </div>

        <Link href={`/posts/${post.slug}`}>
          <h2 className="text-lg font-semibold leading-snug group-hover:text-zinc-600 dark:group-hover:text-zinc-400 transition-colors">
            {post.title}
          </h2>
        </Link>

        {post.excerpt && (
          <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>
        )}

        <div className="flex items-center gap-3 mt-auto pt-4 text-xs text-zinc-500">
          <span>{post.author.username}</span>
          <span>·</span>
          <ReadingTime minutes={post.readingTime} />
          {post._count.comments > 0 && (
            <>
              <span>·</span>
              <span>{post._count.comments} comments</span>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
