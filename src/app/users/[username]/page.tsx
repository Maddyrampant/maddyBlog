import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { getFollowCounts } from "@/services/socialService";
import FollowButton from "@/components/social/FollowButton";
import { ThemePageShell } from "@/components/layout/ThemePageShell";

type Props = {
  params: Promise<{ username: string }>;
};

export default async function UserProfilePage({ params }: Props) {
  const { username } = await params;

  let user: {
    id: string;
    username: string;
    bio: string | null;
    avatarUrl: string | null;
    website: string | null;
    createdAt: Date;
  } | null = null;

  let posts: Array<{
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    coverImage: string | null;
    createdAt: Date;
    _count: { comments: number; reactions: number };
  }> = [];

  let followCounts = { followers: 0, following: 0 };

  try {
    user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        bio: true,
        avatarUrl: true,
        website: true,
        createdAt: true,
      },
    });

    if (!user) notFound();

    [posts, followCounts] = await Promise.all([
      prisma.post.findMany({
        where: { authorId: user.id, status: "PUBLISHED" },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          coverImage: true,
          createdAt: true,
          _count: { select: { comments: true, reactions: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
      getFollowCounts(user.id),
    ]);
  } catch {
    notFound();
  }

  return (
    <ThemePageShell>
      <main className="flex-1 mx-auto max-w-4xl w-full px-4 sm:px-6 py-12">
        <div className="flex items-start gap-6 mb-10">
          <div className="w-20 h-20 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden flex-shrink-0">
            {user.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt={user.username}
                width={80}
                height={80}
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-zinc-500">
                {user.username[0].toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-2xl font-bold">{user.username}</h1>
              <FollowButton userId={user.id} />
            </div>

            {user.bio && (
              <p className="text-zinc-600 dark:text-zinc-400 max-w-lg">
                {user.bio}
              </p>
            )}

            {user.website && (
              <a
                href={user.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-1 text-sm text-blue-600 hover:underline"
              >
                {user.website}
              </a>
            )}

            <div className="flex items-center gap-5 mt-3 text-sm text-zinc-500">
              <span>
                <strong className="text-zinc-700 dark:text-zinc-300">
                  {followCounts.followers}
                </strong>{" "}
                followers
              </span>
              <span>
                <strong className="text-zinc-700 dark:text-zinc-300">
                  {followCounts.following}
                </strong>{" "}
                following
              </span>
              <span>
                Joined{" "}
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-200 dark:border-zinc-800 pt-10">
          <h2 className="text-lg font-semibold mb-6">
            {posts.length > 0 ? `Posts (${posts.length})` : "No posts yet"}
          </h2>

          {posts.length > 0 ? (
            <div className="space-y-6">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="border-b border-zinc-100 dark:border-zinc-800 last:border-0 pb-6"
                >
                  <Link href={`/posts/${post.slug}`} className="group">
                    <h3 className="text-xl font-semibold group-hover:text-zinc-600 dark:group-hover:text-zinc-400 transition-colors">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                  </Link>
                  <div className="flex items-center gap-3 mt-2 text-xs text-zinc-500">
                    <span>
                      {new Date(post.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    {post._count.comments > 0 && (
                      <span>· {post._count.comments} comments</span>
                    )}
                    {post._count.reactions > 0 && (
                      <span>· {post._count.reactions} reactions</span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-500">
              This user hasn&apos;t published any posts yet.
            </p>
          )}
        </div>
      </main>
    </ThemePageShell>
  );
}
