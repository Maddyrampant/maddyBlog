"use client";

import { useI18n } from "@/i18n/provider";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const { dir } = useI18n();

  return (
    <div className="admin-body min-h-screen" dir={dir}>
      <Sidebar />
      <Header />
      <main className="admin-main">
        <div className="max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
