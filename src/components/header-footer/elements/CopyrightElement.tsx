import type { BuilderElement } from "@/lib/header-footer/types";

type CopyrightElementProps = {
  element: BuilderElement;
  themeName: string;
};

export default function CopyrightElement({
  element,
  themeName,
}: CopyrightElementProps) {
  const year = new Date().getFullYear();
  const text = element.content || `© ${year} maddyBlog. All rights reserved.`;
  const displayText = text.includes("{year}")
    ? text.replace(/\{year\}/g, String(year))
    : !text.includes(year.toString())
      ? text.replace(/©/, `© ${year}`)
      : text;

  return (
    <p
      className="text-xs text-center"
      style={{ color: `var(--${themeName}-text-muted, #a1a1aa)` }}
    >
      {displayText}
    </p>
  );
}
