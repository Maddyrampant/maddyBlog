"use client";

import { useState, useEffect } from "react";
import { useI18n } from "@/i18n/provider";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { dir } = useI18n();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(id);
  }, []);

  return (
    <div className="admin-body min-h-screen" dir={mounted ? dir : "ltr"}>
      <Sidebar />
      <Header />
      <main className="admin-main">
        <div className="max-w-[1600px] mx-auto">{children}</div>
      </main>
    </div>
  );
}
