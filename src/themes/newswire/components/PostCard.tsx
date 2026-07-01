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

export default function NewsWirePostCard(post: PostCardProps) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      className="newswire-card p-5 block group"
    >
      <span
        className="text-xs font-bold uppercase tracking-[0.1em]"
        style={{ color: "var(--newswire-accent)" }}
      >
        {post.tags[0]?.name ?? "Article"}
      </span>
      <h3
        className="font-bold text-lg mt-1 leading-tight group-hover newswire-headline"
        style={{ color: "var(--newswire-text)" }}
      >
        {post.title}
      </h3>
      {post.excerpt && (
        <p
          className="text-sm mt-1 line-clamp-2"
          style={{ color: "var(--newswire-text-muted)" }}
        >
          {post.excerpt}
        </p>
      )}
      <div
        className="flex items-center gap-3 mt-3 text-xs"
        style={{ color: "var(--newswire-text-muted)" }}
      >
        <span
          className="font-semibold"
          style={{ color: "var(--newswire-text)" }}
        >
          {post.author.username}
        </span>
        <span
          className="w-1 h-1 rounded-full"
          style={{ background: "var(--newswire-text-muted)" }}
        />
        <span>{post._count.comments} comments</span>
      </div>
    </Link>
  );
}
