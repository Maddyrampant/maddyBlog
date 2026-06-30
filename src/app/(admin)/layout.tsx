import Link from "next/link";
import { requireAdmin } from "@/lib/jwt";
import PluginInjector from "@/components/plugin/PluginInjector";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/posts", label: "Posts" },
  { href: "/admin/posts/new", label: "New Post" },
  { href: "/admin/featured", label: "Featured" },
  { href: "/admin/stories", label: "Stories" },
  { href: "/admin/comments", label: "Comments" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/themes", label: "Appearance" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="flex min-h-screen">
      <aside className="w-56 border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex flex-col">
        <div className="p-5 border-b border-zinc-200 dark:border-zinc-800">
          <Link href="/admin" className="text-lg font-bold tracking-tight">
            maddyBlog
          </Link>
          <p className="text-xs text-zinc-500 mt-0.5">Admin Panel</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          <PluginInjector hook="injectAdminSidebar" />
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-3 py-2.5 text-sm rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-zinc-200 dark:border-zinc-800">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
          >
            ← View Site
          </Link>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
