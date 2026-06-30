"use client";

import { useState, useEffect } from "react";
import { FolderTree, Plus, Edit3, Trash2, Check, X } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import { useTranslation } from "@/i18n/provider";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  _count: { posts: number };
};

export default function CategoriesPage() {
  const t = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then(setCategories)
      .finally(() => setLoading(false));
  }, []);

  function resetForm() {
    setName("");
    setSlug("");
    setDescription("");
    setEditing(null);
    setShowForm(false);
  }

  function edit(cat: Category) {
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || "");
    setEditing(cat.id);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const url = editing ? `/api/categories/${editing}` : "/api/categories";
    const method = editing ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug, description }),
    });
    if (res.ok) {
      const data = await res.json();
      setCategories((prev) => {
        if (editing) return prev.map((c) => (c.id === editing ? { ...c, ...data } : c));
        return [...prev, { ...data, _count: { posts: 0 } }];
      });
      resetForm();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this category?")) return;
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    if (res.ok) setCategories((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div>
      <PageHeader
        title={t("categories.title")}
        subtitle={t("categories.subtitle", { count: categories.length })}
        actions={
          <button onClick={() => { resetForm(); setShowForm(true); }} className="admin-btn admin-btn-primary">
            <Plus size={16} />
            {t("categories.newCategory")}
          </button>
        }
      />

      {showForm && (
        <form onSubmit={handleSubmit} className="admin-card p-5 mb-6 space-y-4">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <FolderTree size={16} className="text-theme-primary" />
            {editing ? t("categories.update") : t("categories.create")}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder={t("categories.namePlaceholder")} className="admin-input" required />
            <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)}
              placeholder={t("categories.slugPlaceholder")} className="admin-input" required />
            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder={t("categories.descriptionPlaceholder")} className="admin-input" />
          </div>
          <div className="flex items-center gap-2">
            <button type="submit" className="admin-btn admin-btn-primary admin-btn-sm">
              <Check size={14} />
              {editing ? t("categories.update") : t("categories.create")}
            </button>
            <button type="button" onClick={resetForm} className="admin-btn admin-btn-outline admin-btn-sm">
              <X size={14} />
              {t("categories.cancel")}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="admin-card p-8 text-center">
          <div className="animate-spin w-6 h-6 border-2 border-theme-primary border-t-transparent rounded-full mx-auto" />
        </div>
      ) : categories.length === 0 ? (
        <div className="admin-card p-12 text-center">
          <FolderTree size={40} className="mx-auto text-zinc-200 dark:text-zinc-700 mb-4" />
          <p className="text-zinc-500 font-medium">{t("categories.noCategories")}</p>
        </div>
      ) : (
        <div className="admin-card">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t("categories.name")}</th>
                  <th>{t("categories.slug")}</th>
                  <th>{t("categories.description")}</th>
                  <th className="text-center">{t("categories.posts")}</th>
                  <th className="text-right">{t("categories.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id}>
                    <td className="font-medium">{cat.name}</td>
                    <td className="text-zinc-400 text-xs font-mono">{cat.slug}</td>
                    <td className="text-zinc-500 text-sm max-w-xs truncate">{cat.description}</td>
                    <td className="text-center">{cat._count.posts}</td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => edit(cat)} className="admin-btn admin-btn-outline admin-btn-xs">
                          <Edit3 size={12} />
                          {t("categories.edit")}
                        </button>
                        <button onClick={() => handleDelete(cat.id)} className="admin-btn admin-btn-danger admin-btn-xs">
                          <Trash2 size={12} />
                          {t("categories.delete")}
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
