import Link from "next/link";

type PostCardProps = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  createdAt: Date;
  author: { username: string };
  tags: { name: string; slug: string }[];
  _count: { comments: number };
};

export default function DefaultPostCard(post: PostCardProps) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      className="group block p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
    >
      <div className="flex items-center gap-2 mb-3">
        {post.tags.slice(0, 2).map((tag) => (
          <span
            key={tag.slug}
            className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
          >
            #{tag.name}
          </span>
        ))}
      </div>
      <h3 className="font-semibold group-hover:text-zinc-600 dark:group-hover:text-zinc-400 transition-colors">
        {post.title}
      </h3>
      {post.excerpt && (
        <p className="text-sm text-zinc-500 mt-2 line-clamp-2">
          {post.excerpt}
        </p>
      )}
      <div className="flex items-center gap-3 mt-4 text-xs text-zinc-400">
        <span>{post.author.username}</span>
        <span>·</span>
        <span>{post._count.comments} comments</span>
      </div>
    </Link>
  );
}
