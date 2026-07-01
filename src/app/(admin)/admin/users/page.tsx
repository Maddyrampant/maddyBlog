"use client";

import { useState, useEffect } from "react";
import { Shield, Search, Trash2 } from "lucide-react";
import UserRoleButton from "./UserRoleButton";
import PageHeader from "@/components/admin/PageHeader";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type User = any;

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/users")
      .then((r) => r.ok && r.json())
      .then((data) => { if (data) setUsers(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter((u: User) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return u.username?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this user? This action cannot be undone.")) return;
    const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
    if (res.ok) setUsers((prev) => prev.filter((u: User) => u.id !== id));
  };

  if (loading) {
    return (
      <div>
        <PageHeader title="Users" subtitle="Loading..." />
        <div className="admin-card p-12 text-center">
          <div className="animate-spin w-6 h-6 border-2 border-theme-primary border-t-transparent rounded-full mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Users"
        subtitle={`${users.length} total users`}
        actions={
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              className="admin-input pl-9 py-1.5 text-sm w-48"
            />
          </div>
        }
      />

      <div className="admin-card">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th className="text-center">Posts</th>
                <th>Joined</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user: User) => (
                <tr key={user.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="admin-avatar w-9 h-9 text-xs">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{user.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-zinc-500 text-sm">{user.email}</td>
                  <td>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                      user.role === "ADMIN"
                        ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                    }`}>
                      <Shield size={10} />
                      {user.role}
                    </span>
                  </td>
                  <td className="text-center text-sm">{user._count?.posts || 0}</td>
                  <td className="text-zinc-400 text-xs whitespace-nowrap">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      month: "short", day: "numeric", year: "numeric",
                    })}
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <UserRoleButton userId={user.id} currentRole={user.role} />
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-1.5 text-zinc-400 hover:text-red-500 transition-colors"
                        title="Delete user"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
