import Link from "next/link";

type AuthorCardProps = {
  username: string;
  bio?: string | null;
  avatarUrl?: string | null;
  website?: string | null;
};

export default function NewsWireAuthorCard({
  username,
  bio,
  website,
}: AuthorCardProps) {
  return (
    <div
      className="newswire-card p-5 flex items-start gap-5"
      style={{ borderLeft: "3px solid var(--newswire-accent)" }}
    >
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold shrink-0"
        style={{
          background: "var(--newswire-accent)",
          color: "#fff",
        }}
      >
        {username[0].toUpperCase()}
      </div>
      <div className="min-w-0">
        <Link
          href={`/users/${username}`}
          className="font-bold transition-colors newswire-headline"
          style={{ color: "var(--newswire-text)" }}
        >
          {username}
        </Link>
        {bio && (
          <p
            className="text-sm mt-1"
            style={{ color: "var(--newswire-text-muted)" }}
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
            style={{ color: "var(--newswire-accent-blue)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--newswire-accent)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--newswire-accent-blue)")
            }
          >
            {website}
          </a>
        )}
      </div>
    </div>
  );
}
