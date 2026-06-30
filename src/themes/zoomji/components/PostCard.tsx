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

export default function ZoomjiPostCard(post: PostCardProps) {
  return (
    <Link href={`/posts/${post.slug}`} className="zoomji-card p-4 block group">
      <div className="flex flex-wrap items-center gap-2 mb-2">
        {post.tags.slice(0, 2).map((tag) => (
          <span
            key={tag.slug}
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: "var(--zoomji-accent-light)", color: "var(--zoomji-accent)" }}
          >
            #{tag.name}
          </span>
        ))}
      </div>
      <h3
        className="font-semibold text-sm group-hover transition-colors line-clamp-2"
        style={{ color: "var(--zoomji-text)" }}
      >
        {post.title}
      </h3>
      {post.excerpt && (
        <p className="text-xs mt-1 line-clamp-2" style={{ color: "var(--zoomji-text-muted)" }}>
          {post.excerpt}
        </p>
      )}
      <div className="flex items-center gap-3 mt-3 text-xs" style={{ color: "var(--zoomji-text-muted)" }}>
        <span className="font-medium" style={{ color: "var(--zoomji-text)" }}>
          {post.author.username}
        </span>
        <span className="w-1 h-1 rounded-full" style={{ background: "var(--zoomji-text-muted)" }} />
        <span>{post._count.comments} comments</span>
      </div>
    </Link>
  );
}
