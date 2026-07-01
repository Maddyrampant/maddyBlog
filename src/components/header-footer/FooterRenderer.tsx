import type { FooterConfig } from "@/lib/header-footer/types";
import RowRenderer from "./RowRenderer";

type FooterRendererProps = {
  config: FooterConfig;
  themeName: string;
};

export default function FooterRenderer({
  config,
  themeName,
}: FooterRendererProps) {
  return (
    <footer
      className="px-4 sm:px-6"
      style={{
        backgroundColor:
          config.settings.backgroundColor || `var(--${themeName}-bg, #ffffff)`,
        color: config.settings.textColor || `var(--${themeName}-text)`,
        borderTop: config.settings.borderTop || undefined,
        paddingTop: config.settings.paddingTop ?? 0,
        paddingBottom: config.settings.paddingBottom ?? 0,
      }}
    >
      {config.rows.map((row, index) => (
        <RowRenderer
          key={row.id}
          row={row}
          themeName={themeName}
          rowIndex={index}
        />
      ))}
    </footer>
  );
}
