import Link from "next/link";

export function DefaultFallbackHeader() {
  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-5 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight">
          maddyBlog
        </Link>
        <nav className="flex gap-6 text-sm">
          <Link
            href="/"
            className="hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/admin"
            className="hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors"
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
