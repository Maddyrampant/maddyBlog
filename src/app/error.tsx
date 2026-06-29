"use client";

import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
      <div className="text-center px-6 max-w-md">
        <h1 className="text-6xl font-bold text-zinc-200 dark:text-zinc-800 mb-4">500</h1>
        <h2 className="text-xl font-semibold mb-2 text-zinc-900 dark:text-zinc-100">
          Something went wrong
        </h2>
        <p className="text-zinc-500 mb-8 text-sm leading-relaxed">
          An unexpected error occurred. Our team has been notified.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={reset}
            className="px-5 py-2.5 text-sm font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 text-sm font-medium border border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Go home
          </Link>
        </div>
        {process.env.NODE_ENV !== "production" && error.digest && (
          <p className="mt-6 text-xs text-zinc-400 font-mono">Error ID: {error.digest}</p>
        )}
      </div>
    </div>
  );
}
