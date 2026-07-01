import type { BuilderElement } from "@/lib/header-footer/types";

type DividerElementProps = {
  element: BuilderElement;
  themeName: string;
};

export default function DividerElement({ themeName }: DividerElementProps) {
  return (
    <hr
      className="w-full border-t"
      style={{ borderColor: `var(--${themeName}-border, #e4e4e7)` }}
    />
  );
}
