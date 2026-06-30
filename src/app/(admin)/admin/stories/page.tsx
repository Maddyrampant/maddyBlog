"use client";

import { useState, useEffect } from "react";
import { Plus, ArrowUp, Trash2, Image as ImageIcon } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import { useTranslation } from "@/i18n/provider";

type Story = {
  id: string; title: string; imageUrl: string; linkUrl: string | null;
  author: { username: string; avatarUrl: string | null };
  active: boolean; order: number; createdAt: string; expiresAt: string | null;
};

export default function StoriesAdminPage() {
  const t = useTranslation();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/stories").then(r => r.json()).then(data => { if (!cancelled) setStories(data); }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !imageUrl) return;
    await fetch("/api/stories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "create", title, imageUrl, linkUrl: linkUrl || undefined }) });
    setTitle(""); setImageUrl(""); setLinkUrl(""); setShowForm(false); location.reload();
  }

  async function handleDelete(id: string) {
    await fetch("/api/stories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "delete", id }) });
    location.reload();
  }

  async function handleMoveUp(index: number) {
    if (index === 0) return;
    const newStories = [...stories];
    [newStories[index - 1], newStories[index]] = [newStories[index], newStories[index - 1]];
    await fetch("/api/stories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "reorder", orders: newStories.map((s, i) => ({ id: s.id, order: i })) }) });
    setStories(newStories);
  }

  return (
    <div>
      <PageHeader
        title={t("stories.title")} subtitle={t("stories.subtitle")}
        actions={<button onClick={() => setShowForm(!showForm)} className="admin-btn admin-btn-primary"><Plus size={16} /> {t("stories.addStory")}</button>}
      />

      {showForm && (
        <form onSubmit={handleCreate} className="admin-card p-5 mb-6 space-y-4">
          <h3 className="text-sm font-semibold flex items-center gap-2"><ImageIcon size={16} className="text-theme-primary" /> {t("stories.newStory")}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t("stories.storyTitle")} className="admin-input" required />
            <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder={t("stories.imageUrl")} className="admin-input" required />
            <input type="url" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder={t("stories.linkUrl")} className="admin-input" />
          </div>
          <div className="flex items-center gap-2">
            <button type="submit" className="admin-btn admin-btn-primary"><Plus size={16} /> {t("stories.createStory")}</button>
            <button type="button" onClick={() => setShowForm(false)} className="admin-btn admin-btn-outline">{t("stories.cancel")}</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="admin-card p-8 text-center">
          <div className="animate-spin w-6 h-6 border-2 border-theme-primary border-t-transparent rounded-full mx-auto" />
        </div>
      ) : stories.length === 0 ? (
        <div className="admin-card p-12 text-center">
          <ImageIcon size={40} className="mx-auto text-zinc-200 dark:text-zinc-700 mb-4" />
          <p className="text-zinc-500 font-medium">{t("stories.noStories")}</p>
          <p className="text-sm text-zinc-400 mt-1">{t("stories.noStoriesHint")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {stories.map((story, i) => (
            <div key={story.id} className="admin-card flex items-center gap-4 px-5 py-4">
              <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-zinc-100 dark:bg-zinc-800 ring-2 ring-zinc-100 dark:ring-zinc-800">
                {story.imageUrl ? <img src={story.imageUrl} alt={story.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-zinc-300"><ImageIcon size={20} /></div>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{story.title}</p>
                <p className="text-xs text-zinc-400 mt-0.5">by {story.author.username}{story.linkUrl && <><span className="mx-1">&middot;</span>{t("stories.hasLink")}</>}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleMoveUp(i)} disabled={i === 0} className="admin-btn admin-btn-outline admin-btn-sm disabled:opacity-30"><ArrowUp size={14} /> {t("stories.moveUp")}</button>
                <button onClick={() => handleDelete(story.id)} className="admin-btn admin-btn-sm admin-btn-danger"><Trash2 size={14} /> {t("stories.delete")}</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
