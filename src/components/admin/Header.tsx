"use client";

import { useState, useEffect } from "react";
import { Search, ChevronDown, LogOut, User, Settings } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation, useI18n } from "@/i18n/provider";
import LanguageSwitcher from "./LanguageSwitcher";
import PluginInjector from "@/components/plugin/PluginInjector";
import NotificationBell from "@/components/social/NotificationBell";

export default function Header() {
  const router = useRouter();
  const t = useTranslation();
  const { dir } = useI18n();
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    setMounted(true);
  }, []);

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch {
      /* ignore */
    }
  }

  return (
    <header
      className="admin-header flex items-center justify-between px-6"
      dir={mounted ? dir : "ltr"}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSearchOpen(!searchOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 text-sm hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors w-64"
        >
          <Search size={16} />
          <span>{t("header.search")}</span>
          <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700 font-medium">
            ⌘K
          </span>
        </button>
      </div>

      <div className="flex items-center gap-1">
        <LanguageSwitcher />

        <PluginInjector extensionPoint="header:right" />

        <NotificationBell />

        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <div className="admin-avatar w-8 h-8 text-xs">A</div>
            <div
              className={`text-left ${dir === "rtl" ? "text-right" : ""} hidden sm:block`}
            >
              <p className="text-sm font-medium leading-tight">
                {t("header.admin")}
              </p>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500 leading-tight">
                {t("header.administrator")}
              </p>
            </div>
            <ChevronDown size={14} className="text-zinc-400" />
          </button>

          {profileOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setProfileOpen(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 py-2 z-20">
                <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-800">
                  <p className="text-sm font-medium">{t("header.admin")}</p>
                  <p className="text-xs text-zinc-400">admin@maddyblog.com</p>
                </div>
                <Link
                  href="/admin/profile"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                  onClick={() => setProfileOpen(false)}
                >
                  <User size={16} className="text-zinc-400" />
                  {t("header.profile")}
                </Link>
                <Link
                  href="/admin/settings"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                  onClick={() => setProfileOpen(false)}
                >
                  <Settings size={16} className="text-zinc-400" />
                  {t("header.settings")}
                </Link>
                <div className="border-t border-zinc-100 dark:border-zinc-800 mt-1 pt-1">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                  >
                    <LogOut size={16} />
                    {t("header.logout")}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
