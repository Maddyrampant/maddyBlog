import Link from "next/link";

type AuthorCardProps = {
  username: string;
  bio?: string | null;
  avatarUrl?: string | null;
  website?: string | null;
};

export default function MadelinAuthorCard({
  username,
  bio,
  avatarUrl,
  website,
}: AuthorCardProps) {
  return (
    <div className="madelin-card p-5 flex items-start gap-5">
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold shrink-0"
        style={{
          background: "var(--madelin-accent-light)",
          color: "var(--madelin-accent)",
        }}
      >
        {avatarUrl ? (
          <span
            className="w-full h-full rounded-full flex items-center justify-center text-sm"
            style={{ background: "var(--madelin-warm-subtle)" }}
          >
            {username[0].toUpperCase()}
          </span>
        ) : (
          username[0].toUpperCase()
        )}
      </div>
      <div className="min-w-0">
        <Link
          href={`/users/${username}`}
          className="font-semibold transition-colors"
          style={{ color: "var(--madelin-accent)" }}
        >
          {username}
        </Link>
        {bio && (
          <p
            className="text-sm mt-1"
            style={{ color: "var(--madelin-text-muted)" }}
          >
            {bio}
          </p>
        )}
        {website && (
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm mt-2 inline-block transition-colors"
            style={{ color: "var(--madelin-text-muted)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--madelin-accent)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--madelin-text-muted)")
            }
          >
            {website}
          </a>
        )}
      </div>
    </div>
  );
}
