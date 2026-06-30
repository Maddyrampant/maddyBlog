"use client";

import { useState, useEffect } from "react";
import { Star, ArrowUp, Trash2, GripVertical } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import { useTranslation } from "@/i18n/provider";

type FeaturedPost = {
  id: string; title: string; slug: string; featuredOrder: number;
  author: { username: string };
  category: { name: string; slug: string } | null;
  _count: { comments: number };
};

export default function FeaturedAdminPage() {
  const t = useTranslation();
  const [featured, setFeatured] = useState<FeaturedPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/featured").then(r => r.json()).then(data => { if (!cancelled) setFeatured(data.posts || []); }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  async function handleToggle(postId: string, isFeatured: boolean) {
    await fetch("/api/featured", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ postId, action: isFeatured ? "remove" : "add" }) });
    location.reload();
  }

  async function handleMoveUp(index: number) {
    if (index === 0) return;
    const newFeatured = [...featured];
    [newFeatured[index - 1], newFeatured[index]] = [newFeatured[index], newFeatured[index - 1]];
    await fetch("/api/featured", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "reorder", orders: newFeatured.map((p, i) => ({ id: p.id, order: i })) }) });
    setFeatured(newFeatured);
  }

  return (
    <div>
      <PageHeader title={t("featured.title")} subtitle={t("featured.subtitle")} />

      {loading ? (
        <div className="admin-card p-8 text-center">
          <div className="animate-spin w-6 h-6 border-2 border-theme-primary border-t-transparent rounded-full mx-auto" />
        </div>
      ) : featured.length === 0 ? (
        <div className="admin-card p-12 text-center">
          <Star size={40} className="mx-auto text-zinc-200 dark:text-zinc-700 mb-4" />
          <p className="text-zinc-500 font-medium">{t("featured.noFeatured")}</p>
          <p className="text-sm text-zinc-400 mt-1">{t("featured.noFeaturedHint")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {featured.map((post, i) => (
            <div key={post.id} className="admin-card flex items-center gap-4 px-5 py-4">
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-lg font-bold text-theme-primary w-6 text-center">{i + 1}</span>
                <GripVertical size={16} className="text-zinc-300" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{post.title}</p>
                <p className="text-xs text-zinc-400 mt-0.5">
                  by {post.author.username}
                  {post.category && <><span className="mx-1">&middot;</span>{post.category.name}</>}
                  <span className="mx-1">&middot;</span>{post._count.comments} comments
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleMoveUp(i)} disabled={i === 0} className="admin-btn admin-btn-outline admin-btn-sm disabled:opacity-30">
                  <ArrowUp size={14} /> {t("featured.moveUp")}
                </button>
                <button onClick={() => handleToggle(post.id, true)} className="admin-btn admin-btn-sm admin-btn-danger">
                  <Trash2 size={14} /> {t("featured.remove")}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
