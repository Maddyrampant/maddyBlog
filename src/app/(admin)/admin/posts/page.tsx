"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, FileText } from "lucide-react";
import DeleteButton from "./DeleteButton";
import PageHeader from "@/components/admin/PageHeader";
import { useTranslation } from "@/i18n/provider";
import type { PostListItem } from "@/types";

export default function AdminPostsPage() {
  const t = useTranslation();
  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/posts")
      .then((r) => r.json())
      .then((data) => setPosts(data.posts ?? []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <PageHeader
          title={t("posts.title")}
          subtitle={t("posts.subtitle", { count: 0 })}
        />
        <div className="admin-card p-12 text-center">
          <div className="animate-spin w-6 h-6 border-2 border-theme-primary border-t-transparent rounded-full mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={t("posts.title")}
        subtitle={t("posts.subtitle", { count: posts.length })}
        actions={
          <Link href="/admin/posts/new" className="admin-btn admin-btn-primary">
            <Plus size={16} />
            {t("posts.newPost")}
          </Link>
        }
      />

      <div className="admin-card">
        {posts.length === 0 ? (
          <p className="p-6 text-sm text-zinc-400 text-center">
            {t("posts.noPosts")}
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
                  <th className="text-right">{t("posts.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id}>
                    <td className="font-medium max-w-xs truncate">
                      <div className="flex items-center gap-2">
                        <FileText
                          size={14}
                          className="text-zinc-300 shrink-0"
                        />
                        <span className="truncate">{post.title}</span>
                      </div>
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
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/posts/${post.slug}`}
                          className="admin-btn admin-btn-outline admin-btn-xs"
                        >
                          {t("posts.view")}
                        </Link>
                        <Link
                          href={`/admin/posts/${post.id}/edit`}
                          className="admin-btn admin-btn-outline admin-btn-xs"
                        >
                          {t("posts.edit")}
                        </Link>
                        <DeleteButton id={post.id} title={post.title} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
