import type { BuilderRow } from "@/lib/header-footer/types";
import ColumnRenderer from "./ColumnRenderer";

type RowRendererProps = {
  row: BuilderRow;
  themeName: string;
  rowIndex?: number;
};

export default function RowRenderer({ row, themeName }: RowRendererProps) {
  return (
    <div
      className={`flex flex-col sm:flex-row w-full ${row.className || ""}`}
      style={{
        backgroundColor: row.settings.backgroundColor || "transparent",
        color: row.settings.textColor || `var(--${themeName}-text)`,
        paddingTop: row.settings.paddingY ?? 12,
        paddingBottom: row.settings.paddingY ?? 12,
        paddingLeft: row.settings.paddingX ?? 16,
        paddingRight: row.settings.paddingX ?? 16,
        maxWidth: row.settings.maxWidth || "100%",
        marginLeft: "auto",
        marginRight: "auto",
        borderBottom: row.settings.borderBottom || undefined,
        borderTop: row.settings.borderTop || undefined,
      }}
    >
      {row.columns.map((column) => (
        <div
          key={column.id}
          className="flex-1 min-w-0"
          style={{ flexBasis: `${column.width}%` }}
        >
          <ColumnRenderer column={column} themeName={themeName} />
        </div>
      ))}
    </div>
  );
}
