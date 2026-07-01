import { getSession } from "@/lib/jwt";
import { redirect } from "next/navigation";
import { Puzzle } from "lucide-react";
import PluginManagerClient from "./PluginManagerClient";
import PageHeader from "@/components/admin/PageHeader";

export default async function PluginsPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/");

  return (
    <div>
      <PageHeader
        title="Plugins"
        subtitle="Extend your blog functionality with plugins"
      />
      <PluginManagerClient />
    </div>
  );
}
