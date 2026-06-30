"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export default function DeleteCommentButton({ id }: { id: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/comments?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      router.refresh();
    } catch {
      alert("Error deleting comment");
    } finally {
      setDeleting(false);
      setConfirming(false);
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-1 justify-end">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="admin-btn admin-btn-danger admin-btn-xs"
        >
          {deleting ? "..." : "Confirm"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="admin-btn admin-btn-outline admin-btn-xs"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="admin-btn admin-btn-outline admin-btn-xs text-red-500 border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-950"
    >
      <Trash2 size={12} />
      Delete
    </button>
  );
}
