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

export default function MadelinPostCard(post: PostCardProps) {
  return (
    <Link href={`/posts/${post.slug}`} className="madelin-card p-6 block group">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {post.tags.slice(0, 2).map((tag) => (
          <span
            key={tag.slug}
            className="text-xs px-2.5 py-1 rounded-full"
            style={{
              background: "var(--madelin-accent-light)",
              color: "var(--madelin-accent)",
            }}
          >
            #{tag.name}
          </span>
        ))}
      </div>
      <h3
        className="font-semibold text-lg group-hover transition-colors"
        style={{ color: "var(--madelin-accent)" }}
      >
        {post.title}
      </h3>
      {post.excerpt && (
        <p
          className="text-sm mt-2 line-clamp-2"
          style={{ color: "var(--madelin-text-muted)" }}
        >
          {post.excerpt}
        </p>
      )}
      <div
        className="flex items-center gap-4 mt-5 text-xs"
        style={{ color: "var(--madelin-text-muted)" }}
      >
        <span className="font-medium" style={{ color: "var(--madelin-text)" }}>
          {post.author.username}
        </span>
        <span
          className="w-1 h-1 rounded-full"
          style={{ background: "var(--madelin-text-muted)" }}
        />
        <span>{post._count.comments} comments</span>
      </div>
    </Link>
  );
}
