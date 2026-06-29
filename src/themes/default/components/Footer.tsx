import Link from "next/link";

type FooterProps = {
  authorName?: string;
};

export default function DefaultFooter({ authorName }: FooterProps) {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 flex items-center justify-between text-sm text-zinc-500">
        <span>
          &copy; {new Date().getFullYear()} maddyBlog.
          {authorName
            ? ` Published by ${authorName}.`
            : " All rights reserved."}
        </span>
        <Link
          href="/"
          className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
        >
          maddyBlog
        </Link>
      </div>
    </footer>
  );
}
