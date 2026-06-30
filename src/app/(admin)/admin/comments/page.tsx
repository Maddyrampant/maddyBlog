"use client";

import { useState, useEffect } from "react";
import { MessageSquare } from "lucide-react";
import DeleteCommentButton from "./DeleteCommentButton";
import PageHeader from "@/components/admin/PageHeader";
import { useTranslation } from "@/i18n/provider";

export default function AdminCommentsPage() {
  const t = useTranslation();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/comments")
      .then((r) => r.json())
      .then(setComments)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <PageHeader
          title={t("comments.title")}
          subtitle={t("comments.subtitle", { count: 0 })}
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
        title={t("comments.title")}
        subtitle={t("comments.subtitle", { count: comments.length })}
      />

      <div className="admin-card">
        {comments.length === 0 ? (
          <p className="p-6 text-sm text-zinc-400 text-center">
            {t("comments.noComments")}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t("comments.author")}</th>
                  <th>{t("comments.comment")}</th>
                  <th>{t("comments.onPost")}</th>
                  <th>{t("comments.date")}</th>
                  <th className="text-right">{t("comments.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {comments.map((comment: any) => (
                  <tr key={comment.id}>
                    <td className="font-medium">
                      {comment.author?.username ?? comment.author?.email}
                    </td>
                    <td className="text-zinc-600 dark:text-zinc-400 max-w-xs truncate">
                      <div className="flex items-center gap-2">
                        <MessageSquare
                          size={14}
                          className="text-zinc-300 shrink-0"
                        />
                        <span className="truncate">{comment.content}</span>
                      </div>
                    </td>
                    <td>
                      <a
                        href={`/posts/${comment.post?.slug}`}
                        className="text-theme-primary hover:underline text-sm"
                      >
                        {comment.post?.title}
                      </a>
                    </td>
                    <td className="text-zinc-400 text-xs whitespace-nowrap">
                      {new Date(comment.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="text-right">
                      <DeleteCommentButton id={comment.id} />
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
