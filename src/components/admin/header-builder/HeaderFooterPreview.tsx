"use client";

import type {
  HeaderConfig,
  FooterConfig,
  BuilderRow,
} from "@/lib/header-footer/types";

interface HeaderFooterPreviewProps {
  header: HeaderConfig;
  footer: FooterConfig;
  themeName: string;
  section: "header" | "footer";
}

const typeColors: Record<string, string> = {
  logo: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300",
  "nav-menu":
    "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
  search: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300",
  "social-icons":
    "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
  button:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
  html: "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300",
  text: "bg-zinc-100 text-zinc-700 dark:bg-zinc-700/50 dark:text-zinc-300",
  divider: "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300",
  spacer:
    "bg-stone-100 text-stone-500 dark:bg-stone-800/50 dark:text-stone-400",
  "cart-icon":
    "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
  "language-switcher":
    "bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300",
  copyright: "bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300",
  newsletter:
    "bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300",
  "back-to-top":
    "bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300",
};

function PreviewElement({ type, label }: { type: string; label: string }) {
  return (
    <div
      className={`px-2 py-1 rounded text-[10px] font-medium leading-tight whitespace-nowrap ${typeColors[type] || "bg-zinc-100 text-zinc-600"}`}
      title={type}
    >
      {label}
    </div>
  );
}

function PreviewColumn({ row }: { row: BuilderRow }) {
  return (
    <div
      className="flex w-full"
      style={{ minHeight: row.settings.height || 48 }}
    >
      {row.columns.map((col) => {
        const pct = (col.width / 12) * 100;
        return (
          <div
            key={col.id}
            className="flex items-center gap-1 px-1.5 py-1 border-r border-zinc-200 dark:border-zinc-700 last:border-r-0 overflow-hidden"
            style={{
              width: `${pct}%`,
              justifyContent:
                col.alignment === "center"
                  ? "center"
                  : col.alignment === "end"
                    ? "flex-end"
                    : "flex-start",
            }}
          >
            {col.elements.length === 0 ? (
              <span className="text-[9px] text-zinc-300 dark:text-zinc-600 italic">
                empty
              </span>
            ) : (
              col.elements
                .filter((el) => el.visibility.desktop)
                .map((el) => (
                  <PreviewElement
                    key={el.id}
                    type={el.type}
                    label={el.type.replace(/-/g, " ")}
                  />
                ))
            )}
          </div>
        );
      })}
    </div>
  );
}

function PreviewRow({
  row,
  backgroundColor,
  textColor,
}: {
  row: BuilderRow;
  backgroundColor?: string;
  textColor?: string;
}) {
  if (!row.settings.visible.desktop) return null;

  return (
    <div
      className="border border-zinc-200 dark:border-zinc-700 rounded-sm"
      style={{
        backgroundColor:
          row.settings.backgroundColor || backgroundColor || "transparent",
        color: row.settings.textColor || textColor || "inherit",
        borderTop: row.settings.borderTop || undefined,
        borderBottom: row.settings.borderBottom || undefined,
      }}
    >
      <div
        className="mx-auto"
        style={{
          maxWidth: row.settings.maxWidth || "100%",
          paddingTop: row.settings.paddingY ?? 0,
          paddingBottom: row.settings.paddingY ?? 0,
          paddingLeft: row.settings.paddingX ?? 8,
          paddingRight: row.settings.paddingX ?? 8,
        }}
      >
        <PreviewColumn row={row} />
      </div>
    </div>
  );
}

export function HeaderFooterPreview({
  header,
  footer,
  section,
}: HeaderFooterPreviewProps) {
  const headerRows: { row: BuilderRow; bg?: string; tc?: string }[] = [];
  if (header.topRow && header.topRow.settings.visible.desktop) {
    headerRows.push({ row: header.topRow });
  }
  if (header.mainRow.settings.visible.desktop) {
    headerRows.push({
      row: header.mainRow,
      bg: header.settings.backgroundColor,
      tc: header.settings.textColor,
    });
  }
  if (header.bottomRow && header.bottomRow.settings.visible.desktop) {
    headerRows.push({ row: header.bottomRow });
  }

  const footerRows = footer.rows.filter((r) => r.settings.visible.desktop);

  return (
    <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden bg-white dark:bg-zinc-900 shadow-sm">
      <div className="text-center text-[10px] text-zinc-400 dark:text-zinc-600 py-1 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-700">
        Header Preview
      </div>

      {section === "header" ? (
        <div className="border-b border-zinc-200 dark:border-zinc-700">
          {headerRows.length === 0 ? (
            <div className="py-8 text-center text-xs text-zinc-300 dark:text-zinc-600">
              No header rows visible on desktop
            </div>
          ) : (
            headerRows.map(({ row, bg, tc }) => (
              <PreviewRow
                key={row.id}
                row={row}
                backgroundColor={bg}
                textColor={tc}
              />
            ))
          )}
        </div>
      ) : (
        <>
          <div className="min-h-[80px] flex items-center justify-center bg-zinc-50 dark:bg-zinc-800/30">
            <span className="text-[10px] text-zinc-300 dark:text-zinc-600">
              Page Content
            </span>
          </div>
          <div
            className="border-t border-zinc-200 dark:border-zinc-700"
            style={{
              backgroundColor: footer.settings.backgroundColor || "transparent",
              color: footer.settings.textColor || "inherit",
              borderTop: footer.settings.borderTop || undefined,
              paddingTop: footer.settings.paddingTop || 0,
              paddingBottom: footer.settings.paddingBottom || 0,
            }}
          >
            <div className="text-center text-[10px] text-zinc-400 dark:text-zinc-600 py-1 bg-zinc-50/50 dark:bg-zinc-800/30 border-b border-zinc-200 dark:border-zinc-700">
              Footer Preview
            </div>
            {footerRows.length === 0 ? (
              <div className="py-8 text-center text-xs text-zinc-300 dark:text-zinc-600">
                No footer rows
              </div>
            ) : (
              footerRows.map((row) => <PreviewRow key={row.id} row={row} />)
            )}
          </div>
        </>
      )}
    </div>
  );
}
