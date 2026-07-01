"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  MessageSquare,
  Users,
  Eye,
  TrendingUp,
  Activity,
  Plus,
} from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import { useTranslation } from "@/i18n/provider";
import PluginInjector from "@/components/plugin/PluginInjector";

interface PostSummary {
  id: string;
  title: string;
  status: string;
  views: number;
  createdAt: string;
  author?: { username: string };
  _count?: { comments: number };
}

export default function AdminDashboard() {
  const t = useTranslation();
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalComments: 0,
    totalUsers: 0,
    totalViews: 0,
  });
  const [recentPosts, setRecentPosts] = useState<PostSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [postsRes, commentsRes, usersRes] = await Promise.all([
          fetch("/api/posts"),
          fetch("/api/comments?count=true"),
          fetch("/api/users"),
        ]);
        const posts: PostSummary[] = await postsRes.json();
        const published = posts.filter((p) => p.status === "PUBLISHED").length;
        const draft = posts.length - published;
        const comments = commentsRes.ok
          ? ((await commentsRes.json()).length ?? 0)
          : 0;
        const users = usersRes.ok ? ((await usersRes.json()).length ?? 0) : 0;
        const views = posts.reduce((sum, p) => sum + (p.views || 0), 0);
        setStats({
          totalPosts: posts.length,
          publishedPosts: published,
          draftPosts: draft,
          totalComments: comments,
          totalUsers: users,
          totalViews: views,
        });
        setRecentPosts(posts.slice(0, 8));
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const statCards = [
    {
      label: t("dashboard.totalPosts"),
      value: stats.totalPosts,
      sub: `${stats.publishedPosts} ${t("dashboard.published")} · ${stats.draftPosts} ${t("dashboard.drafts")}`,
      icon: FileText,
      gradient: "gradient-primary",
    },
    {
      label: t("dashboard.comments"),
      value: stats.totalComments,
      sub: "Across all posts",
      icon: MessageSquare,
      gradient: "gradient-success",
    },
    {
      label: t("dashboard.users"),
      value: stats.totalUsers,
      sub: "Registered accounts",
      icon: Users,
      gradient: "gradient-info",
    },
    {
      label: t("dashboard.pageViews"),
      value: stats.totalViews,
      sub: "Total impressions",
      icon: Eye,
      gradient: "gradient-warning",
    },
  ];

  if (loading) {
    return (
      <div className="admin-card p-12 text-center">
        <div className="animate-spin w-6 h-6 border-2 border-theme-primary border-t-transparent rounded-full mx-auto" />
      </div>
    );
  }

  const total = stats.totalPosts || 1;

  return (
    <div>
      <PageHeader
        title={t("dashboard.title")}
        subtitle={t("dashboard.subtitle")}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="stat-card">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-3xl font-bold">{s.value}</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                    {s.label}
                  </p>
                  {s.sub && (
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                      {s.sub}
                    </p>
                  )}
                </div>
                <div className={`stat-icon ${s.gradient} text-white`}>
                  <Icon size={22} />
                </div>
              </div>
              <div className="mt-4 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${s.gradient}`}
                  style={{
                    width: `${Math.min(100, (Number(s.value) / 50) * 100)}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
        <div className="lg:col-span-2 admin-card">
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-3">
              <Activity size={18} className="text-zinc-400" />
              <h2 className="font-semibold text-sm">
                {t("dashboard.recentPosts")}
              </h2>
            </div>
            <Link
              href="/admin/posts"
              className="text-xs font-medium text-theme-primary hover:underline"
            >
              {t("dashboard.viewAll")}
            </Link>
          </div>
          {recentPosts.length === 0 ? (
            <p className="p-6 text-sm text-zinc-400 text-center">
              {t("dashboard.noPosts")}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{t("posts.titleLabel")}</th>
                    <th>{t("posts.author")}</th>
                    <th>{t("posts.views")}</th>
                    <th>{t("posts.comments")}</th>
                    <th>{t("posts.status")}</th>
                    <th>{t("posts.date")}</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPosts.map((post) => (
                    <tr key={post.id}>
                      <td className="font-medium max-w-[250px] truncate">
                        {post.title}
                      </td>
                      <td className="text-zinc-500">{post.author?.username}</td>
                      <td className="text-zinc-500">{post.views || 0}</td>
                      <td className="text-zinc-500">
                        {post._count?.comments || 0}
                      </td>
                      <td>
                        <span
                          className={`status-badge ${post.status === "PUBLISHED" ? "published" : "draft"}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${post.status === "PUBLISHED" ? "bg-emerald-500" : "bg-amber-500"}`}
                          />
                          {post.status === "PUBLISHED"
                            ? t("posts.published")
                            : t("posts.draft")}
                        </span>
                      </td>
                      <td className="text-zinc-400 text-xs whitespace-nowrap">
                        {new Date(post.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="admin-card">
          <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-3">
              <TrendingUp size={18} className="text-zinc-400" />
              <h2 className="font-semibold text-sm">
                {t("dashboard.contentOverview")}
              </h2>
            </div>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-zinc-500">
                  {t("dashboard.published")}
                </span>
                <span className="font-semibold">{stats.publishedPosts}</span>
              </div>
              <div className="h-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${(stats.publishedPosts / total) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-zinc-500">{t("dashboard.drafts")}</span>
                <span className="font-semibold">{stats.draftPosts}</span>
              </div>
              <div className="h-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${(stats.draftPosts / total) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-zinc-500">
                  {t("dashboard.commentsPerPost")}
                </span>
                <span className="font-semibold">
                  {stats.totalPosts > 0
                    ? (stats.totalComments / stats.totalPosts).toFixed(1)
                    : 0}
                </span>
              </div>
              <div className="h-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full gradient-info rounded-full"
                  style={{
                    width: `${Math.min(100, (stats.totalComments / stats.totalPosts / 5) * 100)}%`,
                  }}
                />
              </div>
            </div>
            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800">
              <Link
                href="/admin/posts/new"
                className="admin-btn admin-btn-primary w-full justify-center"
              >
                <Plus size={16} />
                {t("dashboard.createNewPost")}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <PluginInjector
        extensionPoint="admin:dashboard:widget"
        context={{ stats, recentPosts }}
      />
    </div>
  );
}
