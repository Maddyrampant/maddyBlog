"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, ArrowUpDown } from "lucide-react";

export default function UserRoleButton({ userId, currentRole }: { userId: string; currentRole: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggleRole() {
    setLoading(true);
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
    try {
      await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      router.refresh();
    } catch {
      alert("Failed to update role");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggleRole}
      disabled={loading}
      className="admin-btn admin-btn-outline admin-btn-xs"
    >
      <ArrowUpDown size={12} />
      {loading ? "..." : currentRole === "ADMIN" ? "Make User" : "Make Admin"}
    </button>
  );
}
