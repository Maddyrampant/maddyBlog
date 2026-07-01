import type { BuilderElement } from "@/lib/header-footer/types";

type HTMLElementProps = {
  element: BuilderElement;
  themeName: string;
};

export default function HTMLElement({ element }: HTMLElementProps) {
  if (!element.content) return null;

  return <div dangerouslySetInnerHTML={{ __html: element.content }} />;
}
