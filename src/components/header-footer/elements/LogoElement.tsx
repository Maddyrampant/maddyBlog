import Link from "next/link";
import type { BuilderElement } from "@/lib/header-footer/types";

type LogoElementProps = {
  element: BuilderElement;
  themeName: string;
};

export default function LogoElement({ element, themeName }: LogoElementProps) {
  const text = element.content || "maddyBlog";

  return (
    <Link
      href="/"
      className="text-xl font-bold tracking-tight hover:opacity-80 transition-opacity"
      style={{
        color: `var(--${themeName}-text)`,
      }}
    >
      {text.includes(" ") ? (
        <>
          <span style={{ color: `var(--${themeName}-accent, #3b82f6)` }}>
            {text.split(" ")[0]}
          </span>{" "}
          {text.split(" ").slice(1).join(" ")}
        </>
      ) : (
        text
      )}
    </Link>
  );
}
