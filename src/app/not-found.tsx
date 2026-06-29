import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
      <div className="text-center px-6 max-w-md">
        <h1 className="text-6xl font-bold text-zinc-200 dark:text-zinc-800 mb-4">404</h1>
        <h2 className="text-xl font-semibold mb-2 text-zinc-900 dark:text-zinc-100">
          Page not found
        </h2>
        <p className="text-zinc-500 mb-8 text-sm leading-relaxed">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block px-5 py-2.5 text-sm font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
