import Link from "next/link";

type AuthorCardProps = {
  username: string;
  bio?: string | null;
  avatarUrl?: string | null;
  website?: string | null;
};

export default function DefaultAuthorCard({
  username,
  bio,
  avatarUrl,
  website,
}: AuthorCardProps) {
  return (
    <div className="flex items-start gap-4 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800">
      <div className="w-12 h-12 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-lg font-bold text-zinc-500 shrink-0">
        {avatarUrl ? (
          <span className="w-full h-full rounded-full bg-zinc-300 dark:bg-zinc-600 flex items-center justify-center text-sm">
            {username[0].toUpperCase()}
          </span>
        ) : (
          username[0].toUpperCase()
        )}
      </div>
      <div className="min-w-0">
        <Link
          href={`/users/${username}`}
          className="font-semibold hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors"
        >
          {username}
        </Link>
        {bio && <p className="text-sm text-zinc-500 mt-1">{bio}</p>}
        {website && (
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 mt-1 inline-block"
          >
            {website}
          </a>
        )}
      </div>
    </div>
  );
}
