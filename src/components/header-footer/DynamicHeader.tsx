"use client";

import { useState, useEffect } from "react";
import HeaderRenderer from "./HeaderRenderer";
import type { HeaderConfig } from "@/lib/header-footer/types";
import { getDefaultConfig } from "@/lib/header-footer/storage";

type DynamicHeaderProps = {
  themeName: string;
};

export function DynamicHeader({ themeName }: DynamicHeaderProps) {
  const [config, setConfig] = useState<HeaderConfig | null>(null);

  useEffect(() => {
    fetch(`/api/admin/header-footer?theme=${themeName}`)
      .then((r) => r.json())
      .then((data) => setConfig(data.header))
      .catch(() => {
        const def = getDefaultConfig(themeName);
        setConfig(def.header);
      });
  }, [themeName]);

  if (!config) {
    return (
      <header
        className="h-16 animate-pulse"
        style={{ background: "var(--theme-bg, #f8fafc)" }}
      />
    );
  }

  return <HeaderRenderer config={config} themeName={themeName} />;
}
