"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { BuilderElement } from "@/lib/header-footer/types";

type NavMenuElementProps = {
  element: BuilderElement;
  themeName: string;
};

export default function NavMenuElement({
  element,
  themeName,
}: NavMenuElementProps) {
  const pathname = usePathname();
  const items = element.content
    ? element.content
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : ["Home", "Admin"];

  return (
    <nav className="flex flex-wrap gap-4 sm:gap-6 text-sm">
      {items.map((item) => {
        const href = `/${item.toLowerCase()}`;
        const isActive =
          pathname === href || (href !== "/" && pathname.startsWith(href));

        return (
          <Link
            key={item}
            href={href}
            className="transition-colors"
            style={{
              color: isActive
                ? `var(--${themeName}-accent, #3b82f6)`
                : `var(--${themeName}-text)`,
              fontWeight: isActive ? 600 : 400,
            }}
          >
            {item}
          </Link>
        );
      })}
    </nav>
  );
}
