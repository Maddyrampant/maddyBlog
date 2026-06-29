"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import Link from "next/link";

type Overview = {
  totalViews: number;
  todayViews: number;
  totalUniqueVisitors: number;
  totalPosts: number;
  totalComments: number;
  totalReactions: number;
};

type ChartPoint = { date: string; views: number };
type TrafficSource = { source: string; count: number };
type TopPost = {
  id: string;
  title: string;
  slug: string;
  views: number;
  comments: number;
  reactions: number;
  author: { username: string };
};

export default function AnalyticsPage() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [chart, setChart] = useState<ChartPoint[]>([]);
  const [traffic, setTraffic] = useState<TrafficSource[]>([]);
  const [topPosts, setTopPosts] = useState<TopPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [overviewRes, postsRes] = await Promise.all([
          fetch("/api/analytics/overview"),
          fetch("/api/analytics/posts"),
        ]);

        if (overviewRes.ok) {
          const data = await overviewRes.json();
          setOverview(data.overview);
          setChart(data.viewsChart || []);
          setTraffic(data.trafficSources || []);
        }

        if (postsRes.ok) {
          const data = await postsRes.json();
          setTopPosts(data.posts || []);
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-8">Analytics</h1>
        <p className="text-zinc-500">Loading analytics data…</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">Analytics</h1>

      {overview && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          <StatCard
            label="Total Views"
            value={overview.totalViews.toLocaleString()}
          />
          <StatCard
            label="Today"
            value={overview.todayViews.toLocaleString()}
          />
          <StatCard
            label="Unique Visitors"
            value={overview.totalUniqueVisitors.toLocaleString()}
          />
          <StatCard
            label="Posts"
            value={overview.totalPosts.toLocaleString()}
          />
          <StatCard
            label="Comments"
            value={overview.totalComments.toLocaleString()}
          />
          <StatCard
            label="Reactions"
            value={overview.totalReactions.toLocaleString()}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
          <h2 className="text-sm font-semibold mb-4">Views (Last 7 Days)</h2>
          {chart.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => v.slice(5)}
                />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="views" fill="#18181b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-zinc-500">No data yet</p>
          )}
        </div>

        <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
          <h2 className="text-sm font-semibold mb-4">Traffic Sources</h2>
          {traffic.length > 0 ? (
            <div className="space-y-3">
              {traffic.map((t) => (
                <div key={t.source}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-zinc-600 dark:text-zinc-400 truncate">
                      {t.source}
                    </span>
                    <span className="font-medium">{t.count}</span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-zinc-900 dark:bg-white rounded-full"
                      style={{
                        width: `${(t.count / Math.max(...traffic.map((x) => x.count))) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-500">No traffic data yet</p>
          )}
        </div>
      </div>

      <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-sm font-semibold">Top Posts</h2>
        </div>
        {topPosts.length > 0 ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-left">
                <th className="p-3 font-medium text-zinc-500">Title</th>
                <th className="p-3 font-medium text-zinc-500">Author</th>
                <th className="p-3 font-medium text-zinc-500 text-right">
                  Views
                </th>
                <th className="p-3 font-medium text-zinc-500 text-right">
                  Comments
                </th>
                <th className="p-3 font-medium text-zinc-500 text-right">
                  Reactions
                </th>
              </tr>
            </thead>
            <tbody>
              {topPosts.map((post) => (
                <tr
                  key={post.id}
                  className="border-b border-zinc-200 dark:border-zinc-800 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                >
                  <td className="p-3 font-medium max-w-xs truncate">
                    <Link
                      href={`/posts/${post.slug}`}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {post.title}
                    </Link>
                  </td>
                  <td className="p-3 text-zinc-500">{post.author.username}</td>
                  <td className="p-3 text-right font-medium">
                    {post.views.toLocaleString()}
                  </td>
                  <td className="p-3 text-right text-zinc-500">
                    {post.comments}
                  </td>
                  <td className="p-3 text-right text-zinc-500">
                    {post.reactions}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="p-5 text-sm text-zinc-500">No posts yet</p>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-4">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-zinc-500 mt-1">{label}</p>
    </div>
  );
}
