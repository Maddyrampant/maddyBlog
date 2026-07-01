"use client";

import { useState, useEffect } from "react";
import FooterRenderer from "./FooterRenderer";
import type { FooterConfig } from "@/lib/header-footer/types";
import { getDefaultConfig } from "@/lib/header-footer/storage";

type DynamicFooterProps = {
  themeName: string;
};

export function DynamicFooter({ themeName }: DynamicFooterProps) {
  const [config, setConfig] = useState<FooterConfig | null>(null);

  useEffect(() => {
    fetch(`/api/admin/header-footer?theme=${themeName}`)
      .then((r) => r.json())
      .then((data) => setConfig(data.footer))
      .catch(() => {
        const def = getDefaultConfig(themeName);
        setConfig(def.footer);
      });
  }, [themeName]);

  if (!config) {
    return (
      <footer
        className="h-24 animate-pulse"
        style={{ background: "var(--theme-bg, #f8fafc)" }}
      />
    );
  }

  return <FooterRenderer config={config} themeName={themeName} />;
}
