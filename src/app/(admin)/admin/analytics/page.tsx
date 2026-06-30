"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import Link from "next/link";
import { Eye, Users, FileText, MessageSquare, Heart, TrendingUp, ArrowUpRight } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import { useTranslation } from "@/i18n/provider";
import PluginInjector from "@/components/plugin/PluginInjector";

type Overview = { totalViews: number; todayViews: number; totalUniqueVisitors: number; totalPosts: number; totalComments: number; totalReactions: number };
type ChartPoint = { date: string; views: number };
type TrafficSource = { source: string; count: number };
type TopPost = { id: string; title: string; slug: string; views: number; comments: number; reactions: number; author: { username: string } };

export default function AnalyticsPage() {
  const t = useTranslation();
  const [overview, setOverview] = useState<Overview | null>(null);
  const [chart, setChart] = useState<ChartPoint[]>([]);
  const [traffic, setTraffic] = useState<TrafficSource[]>([]);
  const [topPosts, setTopPosts] = useState<TopPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [overviewRes, postsRes] = await Promise.all([fetch("/api/analytics/overview"), fetch("/api/analytics/posts")]);
        if (overviewRes.ok) { const data = await overviewRes.json(); setOverview(data.overview); setChart(data.viewsChart || []); setTraffic(data.trafficSources || []); }
        if (postsRes.ok) setTopPosts((await postsRes.json()).posts || []);
      } catch { /* ignore */ } finally { setLoading(false); }
    }
    load();
  }, []);

  const overviewCards = [
    { key: "totalViews" as const, label: t("analytics.totalViews"), icon: Eye, gradient: "gradient-primary" },
    { key: "todayViews" as const, label: t("analytics.today"), icon: TrendingUp, gradient: "gradient-success" },
    { key: "totalUniqueVisitors" as const, label: t("analytics.uniqueVisitors"), icon: Users, gradient: "gradient-info" },
    { key: "totalPosts" as const, label: t("analytics.posts"), icon: FileText, gradient: "gradient-warning" },
    { key: "totalComments" as const, label: t("analytics.comments"), icon: MessageSquare, gradient: "gradient-danger" },
    { key: "totalReactions" as const, label: t("analytics.reactions"), icon: Heart, gradient: "gradient-primary" },
  ];

  return (
    <div>
      <PageHeader title={t("analytics.title")} subtitle={t("analytics.subtitle")} />

      {loading ? (
        <div className="admin-card p-12 text-center">
          <div className="animate-spin w-6 h-6 border-2 border-theme-primary border-t-transparent rounded-full mx-auto" />
        </div>
      ) : (
        <>
          {overview && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              {overviewCards.map((card) => {
                const Icon = card.icon;
                const value = overview[card.key];
                return (
                  <div key={card.key} className="stat-card">
                    <div className="flex items-start justify-between mb-2">
                      <div className={`stat-icon w-10 h-10 ${card.gradient} text-white`}><Icon size={18} /></div>
                    </div>
                    <p className="text-2xl font-bold">{typeof value === "number" ? value.toLocaleString() : value}</p>
                    <p className="text-xs text-zinc-400 mt-0.5">{card.label}</p>
                  </div>
                );
              })}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
            <div className="lg:col-span-2 admin-card p-5">
              <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <TrendingUp size={16} className="text-theme-primary" /> {t("analytics.viewsChart")}
              </h2>
              {chart.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={chart}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" strokeOpacity={0.5} />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v) => { const d = new Date(v); return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }); }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e4e4e7", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }} />
                    <Bar dataKey="views" fill="#6366f1" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : <div className="flex items-center justify-center h-[280px] text-sm text-zinc-400">{t("analytics.noData")}</div>}
            </div>
            <div className="admin-card p-5">
              <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <ArrowUpRight size={16} className="text-theme-primary" /> {t("analytics.trafficSources")}
              </h2>
              {traffic.length > 0 ? (
                <div className="space-y-4">
                  {traffic.map((tItem) => {
                    const maxCount = Math.max(...traffic.map((x) => x.count));
                    return (
                      <div key={tItem.source}>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="text-zinc-600 dark:text-zinc-400 truncate text-xs font-medium">{tItem.source}</span>
                          <span className="font-semibold text-xs">{tItem.count}</span>
                        </div>
                        <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                          <div className="h-full rounded-full gradient-primary" style={{ width: `${maxCount > 0 ? (tItem.count / maxCount) * 100 : 0}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : <div className="flex items-center justify-center h-[280px] text-sm text-zinc-400">{t("analytics.noTraffic")}</div>}
            </div>
          </div>

          <PluginInjector extensionPoint="admin:analytics:chart" context={{ overview, chart, traffic }} />

          <div className="admin-card">
            <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
              <h2 className="text-sm font-semibold flex items-center gap-2"><FileText size={16} className="text-theme-primary" /> {t("analytics.topPosts")}</h2>
            </div>
            {topPosts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>{t("posts.titleLabel")}</th>
                      <th>{t("posts.author")}</th>
                      <th className="text-right">{t("analytics.totalViews")}</th>
                      <th className="text-right">{t("analytics.comments")}</th>
                      <th className="text-right">{t("analytics.reactions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topPosts.map((post) => (
                      <tr key={post.id}>
                        <td className="font-medium max-w-xs truncate"><Link href={`/posts/${post.slug}`} className="hover:text-theme-primary transition-colors">{post.title}</Link></td>
                        <td className="text-zinc-500">{post.author.username}</td>
                        <td className="text-right font-semibold">{post.views.toLocaleString()}</td>
                        <td className="text-right text-zinc-500">{post.comments}</td>
                        <td className="text-right text-zinc-500">{post.reactions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <p className="p-6 text-sm text-zinc-400 text-center">{t("analytics.noPosts")}</p>}
          </div>
        </>
      )}
    </div>
  );
}
