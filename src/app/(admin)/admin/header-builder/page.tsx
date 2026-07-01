import { getSession } from "@/lib/jwt";
import { redirect } from "next/navigation";
import HeaderBuilderClient from "./HeaderBuilderClient";

export const metadata = {
  title: "Header & Footer Builder",
};

export default async function HeaderBuilderPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/");
  return <HeaderBuilderClient />;
}
