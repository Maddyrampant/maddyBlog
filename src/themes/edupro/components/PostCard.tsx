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

export default function EduProPostCard(post: PostCardProps) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      className="edupro-card edupro-course-card p-5 block group"
    >
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {post.tags.slice(0, 2).map((tag) => (
          <span
            key={tag.slug}
            className="text-xs px-2 py-0.5 rounded"
            style={{
              background: "var(--edupro-accent-light)",
              color: "var(--edupro-accent)",
            }}
          >
            {tag.name}
          </span>
        ))}
      </div>
      <h3
        className="font-semibold text-base group-hover"
        style={{
          color: "var(--edupro-text)",
          fontFamily: "var(--edupro-font-heading)",
        }}
      >
        {post.title}
      </h3>
      {post.excerpt && (
        <p
          className="text-sm mt-1.5 line-clamp-2"
          style={{ color: "var(--edupro-text-muted)" }}
        >
          {post.excerpt}
        </p>
      )}
      <div
        className="flex items-center justify-between mt-4 pt-3 text-xs"
        style={{
          borderTop: "1px solid var(--edupro-border)",
          color: "var(--edupro-text-muted)",
        }}
      >
        <span className="font-medium" style={{ color: "var(--edupro-text)" }}>
          {post.author.username}
        </span>
        <span>{post._count.comments} comments</span>
      </div>
    </Link>
  );
}
