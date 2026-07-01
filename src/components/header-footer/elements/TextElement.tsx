import type { BuilderElement } from "@/lib/header-footer/types";

type TextElementProps = {
  element: BuilderElement;
  themeName: string;
};

export default function TextElement({ element, themeName }: TextElementProps) {
  return (
    <span style={{ color: `var(--${themeName}-text)` }} className="text-sm">
      {element.content}
    </span>
  );
}
