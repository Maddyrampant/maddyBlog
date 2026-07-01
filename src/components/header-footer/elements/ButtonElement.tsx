import Link from "next/link";
import type { BuilderElement } from "@/lib/header-footer/types";

type ButtonElementProps = {
  element: BuilderElement;
  themeName: string;
};

export default function ButtonElement({
  element,
  themeName,
}: ButtonElementProps) {
  return (
    <Link
      href={element.link || "#"}
      className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-all hover:opacity-90"
      style={{
        backgroundColor: `var(--${themeName}-accent, #3b82f6)`,
        color: "#ffffff",
      }}
    >
      {element.content || "Button"}
    </Link>
  );
}
