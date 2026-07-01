import Link from "next/link";

type AuthorCardProps = {
  username: string;
  bio?: string | null;
  avatarUrl?: string | null;
  website?: string | null;
};

export default function GameverseAuthorCard({
  username,
  bio,
  avatarUrl,
  website,
}: AuthorCardProps) {
  return (
    <div className="gameverse-card p-5 flex items-start gap-5">
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-black shrink-0"
        style={{
          background:
            "linear-gradient(135deg, var(--gameverse-neon-purple), var(--gameverse-neon-cyan))",
          color: "#fff",
        }}
      >
        {avatarUrl ? (
          <span
            className="w-full h-full rounded-full flex items-center justify-center text-sm"
            style={{ background: "var(--gameverse-card-bg)" }}
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
          className="font-bold transition-colors"
          style={{ color: "var(--gameverse-neon-purple)" }}
        >
          {username}
        </Link>
        {bio && (
          <p
            className="text-sm mt-1"
            style={{ color: "var(--gameverse-text-muted)" }}
          >
            {bio}
          </p>
        )}
        {website && (
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm mt-2 inline-block transition-colors font-mono"
            style={{ color: "var(--gameverse-text-muted)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--gameverse-neon-purple)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--gameverse-text-muted)")
            }
          >
            {website}
          </a>
        )}
      </div>
    </div>
  );
}
