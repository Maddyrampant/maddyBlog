import type { BuilderColumn } from "@/lib/header-footer/types";
import { elementRenderers } from "./elements";

type ColumnRendererProps = {
  column: BuilderColumn;
  themeName: string;
};

const alignmentClasses: Record<string, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  stretch: "justify-stretch",
};

const alignmentFlex: Record<string, string> = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  stretch: "stretch",
};

export default function ColumnRenderer({
  column,
  themeName,
}: ColumnRendererProps) {
  const align = column.alignment || "start";

  return (
    <div
      className={`flex flex-col gap-2 ${alignmentClasses[align] || "justify-start"}`}
      style={{
        flexBasis: `${column.width}%`,
        alignItems: alignmentFlex[align] || "flex-start",
      }}
    >
      {column.elements
        .filter(
          (el) =>
            el.visibility.desktop ||
            el.visibility.tablet ||
            el.visibility.mobile,
        )
        .map((element) => {
          const Renderer = elementRenderers[element.type];
          if (!Renderer) return null;

          return (
            <div key={element.id} className={element.className || ""}>
              <Renderer element={element} themeName={themeName} />
            </div>
          );
        })}
    </div>
  );
}
