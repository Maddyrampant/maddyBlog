import Link from "next/link";

type AuthorCardProps = {
  username: string;
  bio?: string | null;
  avatarUrl?: string | null;
  website?: string | null;
};

export default function DigitechAuthorCard({
  username,
  bio,
  avatarUrl,
  website,
}: AuthorCardProps) {
  return (
    <div className="digitech-card p-5 flex items-start gap-5">
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold shrink-0"
        style={{
          background: "var(--digitech-accent-glow)",
          color: "var(--digitech-accent)",
        }}
      >
        {avatarUrl ? (
          <span
            className="w-full h-full rounded-full flex items-center justify-center text-sm"
            style={{ background: "var(--digitech-card-bg)" }}
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
          style={{ color: "var(--digitech-accent)" }}
        >
          {username}
        </Link>
        {bio && (
          <p
            className="text-sm mt-1"
            style={{ color: "var(--digitech-text-muted)" }}
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
            style={{ color: "var(--digitech-text-muted)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--digitech-accent)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--digitech-text-muted)")
            }
          >
            {website}
          </a>
        )}
      </div>
    </div>
  );
}
