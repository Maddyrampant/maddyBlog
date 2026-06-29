"use client";

import { ThemeProvider } from "@/core/theme/ThemeProvider";

export default function ThemeClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
