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

export default function ZoomgPostCard(post: PostCardProps) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      className="zoomg-card zoomg-card-hover block group overflow-hidden"
    >
      <div className="p-4">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {post.tags.slice(0, 2).map((tag) => (
            <span
              key={tag.slug}
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{
                background: "var(--zoomg-accent-light)",
                color: "var(--zoomg-accent)",
              }}
            >
              {tag.name}
            </span>
          ))}
        </div>
        <h3
          className="font-bold text-sm leading-snug group-hover transition-colors line-clamp-2"
          style={{ color: "var(--zoomg-text-primary)" }}
        >
          {post.title}
        </h3>
        {post.excerpt && (
          <p
            className="text-xs mt-1.5 line-clamp-2 leading-relaxed"
            style={{ color: "var(--zoomg-text-muted)" }}
          >
            {post.excerpt}
          </p>
        )}
        <div
          className="flex items-center gap-2 mt-3 text-xs"
          style={{ color: "var(--zoomg-text-muted)" }}
        >
          <span className="font-medium" style={{ color: "var(--zoomg-text-primary)" }}>
            {post.author.username}
          </span>
          <span
            className="w-1 h-1 rounded-full inline-block"
            style={{ background: "var(--zoomg-text-muted)" }}
          />
          <span>{post._count.comments} دیدگاه</span>
        </div>
      </div>
    </Link>
  );
}
