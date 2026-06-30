import { prisma } from "@/lib/prisma";
import { Users, Shield } from "lucide-react";
import UserRoleButton from "./UserRoleButton";
import PageHeader from "@/components/admin/PageHeader";

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    include: { _count: { select: { posts: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <PageHeader
        title="Users"
        subtitle={`${users.length} total users`}
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
              {users.map((user) => (
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
                  <td className="text-center text-sm">{user._count.posts}</td>
                  <td className="text-zinc-400 text-xs whitespace-nowrap">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      month: "short", day: "numeric", year: "numeric",
                    })}
                  </td>
                  <td className="text-right">
                    <UserRoleButton userId={user.id} currentRole={user.role} />
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
