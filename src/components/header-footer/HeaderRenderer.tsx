"use client";

import type { HeaderConfig } from "@/lib/header-footer/types";
import RowRenderer from "./RowRenderer";

type HeaderRendererProps = {
  config: HeaderConfig;
  themeName: string;
};

export default function HeaderRenderer({
  config,
  themeName,
}: HeaderRendererProps) {
  const isSticky = config.settings.sticky;
  const isTransparent = config.settings.transparent;

  return (
    <header
      className={`w-full z-50 ${isSticky ? "sticky top-0" : ""}`}
      style={{
        backgroundColor: isTransparent
          ? "transparent"
          : config.settings.backgroundColor ||
            `var(--${themeName}-bg, #ffffff)`,
        color: config.settings.textColor || `var(--${themeName}-text)`,
        borderBottom: config.settings.borderBottom || undefined,
        boxShadow: config.settings.boxShadow || undefined,
        backdropFilter: isTransparent ? "blur(8px)" : undefined,
      }}
    >
      {config.topRow && (
        <div className="hidden md:block">
          <RowRenderer row={config.topRow} themeName={themeName} rowIndex={0} />
        </div>
      )}
      <RowRenderer row={config.mainRow} themeName={themeName} rowIndex={1} />
      {config.bottomRow && (
        <div className="hidden md:block">
          <RowRenderer
            row={config.bottomRow}
            themeName={themeName}
            rowIndex={2}
          />
        </div>
      )}
    </header>
  );
}
