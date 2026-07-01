"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Search, Trash2, Check, X } from "lucide-react";
import DeleteCommentButton from "./DeleteCommentButton";
import PageHeader from "@/components/admin/PageHeader";
import { useTranslation } from "@/i18n/provider";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Comment = any;

export default function AdminCommentsPage() {
  const t = useTranslation();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [editing, setEditing] = useState<{ id: string; content: string } | null>(null);

  useEffect(() => {
    fetch("/api/comments")
      .then((r) => r.ok && r.json())
      .then((data) => { if (data) setComments(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = comments.filter((c: Comment) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.content?.toLowerCase().includes(q) ||
      c.author?.username?.toLowerCase().includes(q) ||
      c.post?.title?.toLowerCase().includes(q)
    );
  });

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleBulkDelete = async () => {
    for (const id of selected) {
      await fetch(`/api/comments?id=${id}`, { method: "DELETE" });
    }
    setComments((prev) => prev.filter((c: Comment) => !selected.has(c.id)));
    setSelected(new Set());
  };

  const handleEdit = async (id: string) => {
    if (!editing) return;
    const res = await fetch(`/api/comments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: editing.content }),
    });
    if (res.ok) {
      setComments((prev: Comment[]) =>
        prev.map((c: Comment) =>
          c.id === id ? { ...c, content: editing.content } : c,
        ),
      );
    }
    setEditing(null);
  };

  if (loading) {
    return (
      <div>
        <PageHeader title={t("comments.title")} subtitle={t("comments.subtitle", { count: 0 })} />
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
        actions={
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search comments..."
                className="admin-input pl-9 py-1.5 text-sm w-48"
              />
            </div>
            {selected.size > 0 && (
              <button onClick={handleBulkDelete} className="admin-btn admin-btn-danger text-sm">
                <Trash2 size={14} /> Delete ({selected.size})
              </button>
            )}
          </div>
        }
      />

      <div className="admin-card">
        {filtered.length === 0 ? (
          <p className="p-6 text-sm text-zinc-400 text-center">
            {search ? "No comments match your search." : t("comments.noComments")}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="w-8">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) setSelected(new Set(filtered.map((c: Comment) => c.id)));
                        else setSelected(new Set());
                      }}
                      checked={selected.size === filtered.length && filtered.length > 0}
                    />
                  </th>
                  <th>{t("comments.author")}</th>
                  <th>{t("comments.comment")}</th>
                  <th>{t("comments.onPost")}</th>
                  <th>{t("comments.date")}</th>
                  <th className="text-right">{t("comments.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((comment: Comment) => (
                  <tr key={comment.id} className={selected.has(comment.id) ? "bg-theme-primary/5" : ""}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selected.has(comment.id)}
                        onChange={() => toggleSelect(comment.id)}
                      />
                    </td>
                    <td className="font-medium">{comment.author?.username ?? comment.author?.email}</td>
                    <td className="text-zinc-600 dark:text-zinc-400 max-w-xs">
                      <div className="flex items-center gap-2">
                        <MessageSquare size={14} className="text-zinc-300 shrink-0" />
                        {(() => {
                          const editState = editing;
                          return editState && editState.id === comment.id ? (
                            <div className="flex items-center gap-1 flex-1">
                              <input
                                type="text"
                                value={editState.content}
                                onChange={(e) => setEditing({ ...editState, content: e.target.value })}
                                className="admin-input text-xs py-1 flex-1"
                                autoFocus
                              />
                              <button onClick={() => handleEdit(comment.id)} className="p-1 text-green-500 hover:text-green-600">
                                <Check size={14} />
                              </button>
                              <button onClick={() => setEditing(null)} className="p-1 text-zinc-400 hover:text-zinc-600">
                                <X size={14} />
                              </button>
                            </div>
                          ) : (
                            <span
                              className="truncate cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-200"
                              onDoubleClick={() => setEditing({ id: comment.id, content: comment.content })}
                            >
                              {comment.content}
                            </span>
                          );
                        })()}
                      </div>
                    </td>
                    <td>
                      <a href={`/posts/${comment.post?.slug}`} className="text-theme-primary hover:underline text-sm">
                        {comment.post?.title}
                      </a>
                    </td>
                    <td className="text-zinc-400 text-xs whitespace-nowrap">
                      {new Date(comment.createdAt).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric",
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
