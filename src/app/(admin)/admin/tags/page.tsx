"use client";

import { useState, useEffect } from "react";
import { Tags, Plus, Edit3, Trash2, Check, X } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import { useTranslation } from "@/i18n/provider";

type Tag = {
  id: string;
  name: string;
  slug: string;
  _count: { posts: number };
};

export default function TagsPage() {
  const t = useTranslation();
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  useEffect(() => {
    fetch("/api/tags")
      .then((r) => r.json())
      .then(setTags)
      .finally(() => setLoading(false));
  }, []);

  function resetForm() {
    setName("");
    setSlug("");
    setEditing(null);
    setShowForm(false);
  }

  function edit(tag: Tag) {
    setName(tag.name);
    setSlug(tag.slug);
    setEditing(tag.id);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const url = editing ? `/api/tags/${editing}` : "/api/tags";
    const method = editing ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug }),
    });
    if (res.ok) {
      const data = await res.json();
      setTags((prev) => {
        if (editing) return prev.map((t) => (t.id === editing ? { ...t, ...data } : t));
        return [...prev, { ...data, _count: { posts: 0 } }];
      });
      resetForm();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this tag?")) return;
    const res = await fetch(`/api/tags/${id}`, { method: "DELETE" });
    if (res.ok) setTags((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div>
      <PageHeader
        title={t("tags.title")}
        subtitle={t("tags.subtitle", { count: tags.length })}
        actions={
          <button onClick={() => { resetForm(); setShowForm(true); }} className="admin-btn admin-btn-primary">
            <Plus size={16} />
            {t("tags.newTag")}
          </button>
        }
      />

      {showForm && (
        <form onSubmit={handleSubmit} className="admin-card p-5 mb-6 space-y-4">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Tags size={16} className="text-theme-primary" />
            {editing ? t("tags.update") : t("tags.create")}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder={t("tags.namePlaceholder")} className="admin-input" required />
            <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)}
              placeholder={t("tags.slugPlaceholder")} className="admin-input" required />
          </div>
          <div className="flex items-center gap-2">
            <button type="submit" className="admin-btn admin-btn-primary admin-btn-sm">
              <Check size={14} />
              {editing ? t("tags.update") : t("tags.create")}
            </button>
            <button type="button" onClick={resetForm} className="admin-btn admin-btn-outline admin-btn-sm">
              <X size={14} />
              {t("tags.cancel")}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="admin-card p-8 text-center">
          <div className="animate-spin w-6 h-6 border-2 border-theme-primary border-t-transparent rounded-full mx-auto" />
        </div>
      ) : tags.length === 0 ? (
        <div className="admin-card p-12 text-center">
          <Tags size={40} className="mx-auto text-zinc-200 dark:text-zinc-700 mb-4" />
          <p className="text-zinc-500 font-medium">{t("tags.noTags")}</p>
        </div>
      ) : (
        <div className="admin-card">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t("tags.name")}</th>
                  <th>{t("tags.slug")}</th>
                  <th className="text-center">{t("tags.posts")}</th>
                  <th className="text-right">{t("tags.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {tags.map((tag) => (
                  <tr key={tag.id}>
                    <td className="font-medium">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-theme-primary/40" />
                        {tag.name}
                      </div>
                    </td>
                    <td className="text-zinc-400 text-xs font-mono">{tag.slug}</td>
                    <td className="text-center">{tag._count.posts}</td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => edit(tag)} className="admin-btn admin-btn-outline admin-btn-xs">
                          <Edit3 size={12} />
                          {t("tags.edit")}
                        </button>
                        <button onClick={() => handleDelete(tag.id)} className="admin-btn admin-btn-danger admin-btn-xs">
                          <Trash2 size={12} />
                          {t("tags.delete")}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
