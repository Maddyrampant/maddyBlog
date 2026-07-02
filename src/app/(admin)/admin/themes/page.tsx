import { getSession } from "@/lib/jwt";
import { redirect } from "next/navigation";
import ThemeManagerClient from "./ThemeManagerClient";
import PageHeader from "@/components/admin/PageHeader";

export default async function ThemesPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/");

  return (
    <div>
      <PageHeader
        title="Appearance"
        subtitle="Manage your blog themes and appearance settings"
      />
      <ThemeManagerClient />
    </div>
  );
}
