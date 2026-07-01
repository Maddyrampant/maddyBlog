import Image from "next/image";
import Link from "next/link";

type PostCardProps = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage?: string | null;
  createdAt: Date;
  author: { username: string };
  tags: { name: string; slug: string }[];
  category?: { name: string; slug: string } | null;
  _count: { comments: number };
};

export default function GameversePostCard(post: PostCardProps) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      className="gameverse-card p-6 block group"
    >
      {post.coverImage && (
        <div className="aspect-[16/9] overflow-hidden rounded-lg mb-4 relative">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 400px"
          />
        </div>
      )}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {post.tags.slice(0, 2).map((tag) => (
          <span
            key={tag.slug}
            className="text-xs px-2.5 py-1 rounded-full font-semibold"
            style={{
              background: "var(--gameverse-accent-light)",
              color: "var(--gameverse-neon-purple)",
            }}
          >
            #{tag.name}
          </span>
        ))}
      </div>
      <h3
        className="font-bold text-lg leading-tight group-hover transition-colors"
        style={{ color: "var(--gameverse-text)" }}
      >
        {post.title}
      </h3>
      {post.excerpt && (
        <p
          className="text-sm mt-2 line-clamp-2"
          style={{ color: "var(--gameverse-text-muted)" }}
        >
          {post.excerpt}
        </p>
      )}
      <div
        className="flex items-center gap-4 mt-4 text-xs font-mono"
        style={{ color: "var(--gameverse-text-muted)" }}
      >
        <span
          className="font-semibold"
          style={{ color: "var(--gameverse-text)" }}
        >
          {post.author.username}
        </span>
        <span
          className="w-1 h-1 rounded-full"
          style={{ background: "var(--gameverse-text-muted)" }}
        />
        <span>{post._count.comments} comments</span>
      </div>
    </Link>
  );
}
