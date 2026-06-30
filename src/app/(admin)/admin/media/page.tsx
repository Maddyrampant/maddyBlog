"use client";

import { useState } from "react";
import { Image, Upload, File, X, Copy, Check } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import { useTranslation } from "@/i18n/provider";

type MediaItem = {
  url: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
};

export default function MediaPage() {
  const t = useTranslation();
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        setMedia((prev) => [{
          url: data.url,
          name: file.name,
          size: file.size,
          type: file.type,
          uploadedAt: new Date().toISOString(),
        }, ...prev]);
      }
    } catch {
      /* ignore */
    } finally {
      setUploading(false);
    }
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  }

  function formatSize(bytes: number) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }

  return (
    <div>
      <PageHeader
        title={t("media.title")}
        subtitle={t("media.subtitle")}
        actions={
          <label className="admin-btn admin-btn-primary cursor-pointer">
            <Upload size={16} />
            {t("media.upload")}
            <input type="file" className="hidden" onChange={handleUpload} accept="image/*" />
          </label>
        }
      />

      {uploading && (
        <div className="admin-card p-5 mb-6 flex items-center gap-3">
          <div className="animate-spin w-5 h-5 border-2 border-theme-primary border-t-transparent rounded-full" />
          <span className="text-sm text-zinc-500">{t("common.loading")}</span>
        </div>
      )}

      {media.length === 0 ? (
        <div className="admin-card p-12 text-center">
          <Image size={40} className="mx-auto text-zinc-200 dark:text-zinc-700 mb-4" />
          <p className="text-zinc-500 font-medium">{t("media.noMedia")}</p>
          <p className="text-sm text-zinc-400 mt-1">{t("media.dropHint")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {media.map((item, i) => (
            <div key={i} className="admin-card overflow-hidden group">
              <div className="aspect-square bg-zinc-100 dark:bg-zinc-800 relative overflow-hidden">
                {item.type.startsWith("image/") ? (
                  <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <File size={32} className="text-zinc-300" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => copyUrl(item.url)}
                    className="p-2 bg-white rounded-full shadow-lg hover:scale-110 transition-transform"
                  >
                    {copied === item.url ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
              <div className="p-2.5">
                <p className="text-xs truncate font-medium">{item.name}</p>
                <p className="text-[10px] text-zinc-400 mt-0.5">{formatSize(item.size)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
