import Link from "next/link";

type AuthorCardProps = {
  username: string;
  bio?: string | null;
  avatarUrl?: string | null;
  website?: string | null;
};

export default function ZoomgAuthorCard({ username, bio, avatarUrl, website }: AuthorCardProps) {
  return (
    <div className="zoomg-card p-5 flex items-start gap-4">
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold shrink-0"
        style={{ background: "var(--zoomg-accent-light)", color: "var(--zoomg-accent)" }}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={username}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          username[0].toUpperCase()
        )}
      </div>
      <div className="min-w-0">
        <Link
          href={`/users/${username}`}
          className="font-semibold transition-colors"
          style={{ color: "var(--zoomg-accent)" }}
        >
          {username}
        </Link>
        {bio && (
          <p
            className="text-sm mt-1 leading-relaxed"
            style={{ color: "var(--zoomg-text-muted)" }}
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
            style={{ color: "var(--zoomg-text-muted)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--zoomg-accent)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--zoomg-text-muted)")}
          >
            {website}
          </a>
        )}
      </div>
    </div>
  );
}
