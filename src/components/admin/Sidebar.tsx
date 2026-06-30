"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  PlusSquare,
  Star,
  BookOpen,
  MessageSquare,
  BarChart3,
  Palette,
  ExternalLink,
  Tags,
  FolderTree,
  Users,
  Mail,
  Image,
  Settings,
} from "lucide-react";
import { useTranslation, useI18n } from "@/i18n/provider";
import PluginInjector from "@/components/plugin/PluginInjector";

export default function Sidebar() {
  const pathname = usePathname();
  const t = useTranslation();
  const { dir } = useI18n();

  const navSections = [
    {
      title: t("nav.general"),
      items: [
        { href: "/admin", label: t("nav.dashboard"), icon: LayoutDashboard },
      ],
    },
    {
      title: t("nav.content"),
      items: [
        { href: "/admin/posts", label: t("nav.posts"), icon: FileText },
        { href: "/admin/posts/new", label: t("nav.newPost"), icon: PlusSquare },
        { href: "/admin/featured", label: t("nav.featured"), icon: Star },
        { href: "/admin/stories", label: t("nav.stories"), icon: BookOpen },
        { href: "/admin/comments", label: t("nav.comments"), icon: MessageSquare },
        { href: "/admin/categories", label: t("nav.categories"), icon: FolderTree },
        { href: "/admin/tags", label: t("nav.tags"), icon: Tags },
      ],
    },
    {
      title: t("nav.insights"),
      items: [
        { href: "/admin/analytics", label: t("nav.analytics"), icon: BarChart3 },
      ],
    },
    {
      title: t("nav.customize"),
      items: [
        { href: "/admin/themes", label: t("nav.appearance"), icon: Palette },
        { href: "/admin/media", label: t("nav.media"), icon: Image },
        { href: "/admin/users", label: t("nav.users"), icon: Users },
        { href: "/admin/subscribers", label: t("nav.subscribers"), icon: Mail },
        { href: "/admin/settings", label: t("nav.settings"), icon: Settings },
      ],
    },
  ];

  return (
    <aside className="admin-sidebar custom-scroll" dir={dir}>
      <div className="flex items-center gap-3 px-5 h-[70px] border-b border-zinc-100 dark:border-zinc-800/50">
        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-white font-bold text-sm">
          M
        </div>
        <div>
          <Link href="/admin" className="text-base font-bold tracking-tight block leading-tight">
            {t("app.name")}
          </Link>
          <span className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
            {t("app.tagline")}
          </span>
        </div>
      </div>

      <nav className="py-4">
        {navSections.map((section) => (
          <div key={section.title}>
            <div className="sidebar-section-title">{section.title}</div>
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || 
                (item.href !== "/admin" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`sidebar-item ${isActive ? "active" : ""}`}
                >
                  <Icon className="sidebar-icon" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}

        <PluginInjector extensionPoint="admin:sidebar" />
      </nav>

      <div className="border-t border-zinc-100 dark:border-zinc-800/50 p-3 mt-auto">
        <Link href="/" className="sidebar-item text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
          <ExternalLink className="sidebar-icon" />
          <span>{t("nav.viewSite")}</span>
        </Link>
      </div>
    </aside>
  );
}
