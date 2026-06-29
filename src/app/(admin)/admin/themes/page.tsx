import { getSession } from "@/lib/jwt";
import { redirect } from "next/navigation";
import ThemeManagerClient from "./ThemeManagerClient";

export default async function ThemesPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/");

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Themes</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Manage your blog appearance and theme settings
          </p>
        </div>
      </div>

      <ThemeManagerClient />
    </div>
  );
}
