"use client";

import { useState, useEffect } from "react";
import { Mail, ExternalLink, Trash2, Download } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import { useTranslation } from "@/i18n/provider";

type Subscriber = {
  id: string;
  email: string;
  createdAt: string;
};

export default function SubscribersPage() {
  const t = useTranslation();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/subscribers")
      .then((r) => r.ok && r.json())
      .then((data) => { if (data) setSubscribers(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/subscribers/${id}`, { method: "DELETE" });
    if (res.ok) setSubscribers((prev) => prev.filter((s) => s.id !== id));
  };

  const handleExportCSV = () => {
    const header = "Email,Date\n";
    const rows = subscribers.map((s) => `${s.email},${s.createdAt}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <PageHeader
        title={t("subscribers.title")}
        subtitle={t("subscribers.subtitle", { count: subscribers.length })}
        actions={
          subscribers.length > 0 ? (
            <button onClick={handleExportCSV} className="admin-btn admin-btn-secondary">
              <Download size={16} /> Export CSV
            </button>
          ) : undefined
        }
      />

      {loading ? (
        <div className="admin-card p-8 text-center">
          <div className="animate-spin w-6 h-6 border-2 border-theme-primary border-t-transparent rounded-full mx-auto" />
        </div>
      ) : subscribers.length === 0 ? (
        <div className="admin-card p-12 text-center">
          <Mail size={40} className="mx-auto text-zinc-200 dark:text-zinc-700 mb-4" />
          <p className="text-zinc-500 font-medium">{t("subscribers.noSubscribers")}</p>
        </div>
      ) : (
        <div className="admin-card">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t("subscribers.email")}</th>
                  <th>{t("subscribers.date")}</th>
                  <th className="text-right">{t("comments.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((sub) => (
                  <tr key={sub.id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <Mail size={14} className="text-zinc-300" />
                        <span className="font-medium">{sub.email}</span>
                        <a href={`mailto:${sub.email}`} className="text-theme-primary hover:underline ml-1">
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    </td>
                    <td className="text-zinc-400 text-xs whitespace-nowrap">
                      {new Date(sub.createdAt).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric",
                      })}
                    </td>
                    <td className="text-right">
                      <button
                        onClick={() => handleDelete(sub.id)}
                        className="p-1.5 text-zinc-400 hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
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
