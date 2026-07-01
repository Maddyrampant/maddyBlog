import Link from "next/link";

type PostCardProps = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  createdAt: Date;
  author: { username: string };
  tags: { name: string; slug: string }[];
  _count: { comments: number };
};

export default function DigitechPostCard(post: PostCardProps) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      className="digitech-card overflow-hidden block group"
    >
      {post.coverImage && (
        <div className="aspect-[16/9] relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url(${post.coverImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--digitech-card-bg)] to-transparent" />
        </div>
      )}
      <div className="p-5">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {post.tags.slice(0, 2).map((tag) => (
            <span
              key={tag.slug}
              className="text-xs px-2.5 py-1 rounded-full"
              style={{
                background: "var(--digitech-accent-glow)",
                color: "var(--digitech-accent)",
              }}
            >
              #{tag.name}
            </span>
          ))}
        </div>
        <h3
          className="font-semibold text-lg transition-colors group-hover"
          style={{ color: "var(--digitech-text)" }}
        >
          {post.title}
        </h3>
        {post.excerpt && (
          <p
            className="text-sm mt-2 line-clamp-2"
            style={{ color: "var(--digitech-text-muted)" }}
          >
            {post.excerpt}
          </p>
        )}
        <div
          className="flex items-center gap-4 mt-4 text-xs"
          style={{ color: "var(--digitech-text-muted)" }}
        >
          <span
            className="font-medium"
            style={{ color: "var(--digitech-text)" }}
          >
            {post.author.username}
          </span>
          <span
            className="w-1 h-1 rounded-full"
            style={{ background: "var(--digitech-text-muted)" }}
          />
          <span>{post._count.comments} comments</span>
        </div>
      </div>
    </Link>
  );
}
