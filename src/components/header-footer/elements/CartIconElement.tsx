import Link from "next/link";
import type { BuilderElement } from "@/lib/header-footer/types";

type CartIconElementProps = {
  element: BuilderElement;
  themeName: string;
};

export default function CartIconElement({
  element,
  themeName,
}: CartIconElementProps) {
  return (
    <Link
      href={element.link || "/cart"}
      className="relative inline-flex items-center justify-center p-2 transition-colors hover:opacity-80"
      style={{ color: `var(--${themeName}-text)` }}
      aria-label={element.label || "Shopping cart"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="8" cy="21" r="1" />
        <circle cx="19" cy="21" r="1" />
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
      </svg>
      <span
        className="absolute -top-0.5 -right-0.5 w-4 h-4 text-[10px] font-bold flex items-center justify-center rounded-full"
        style={{
          backgroundColor: `var(--${themeName}-accent, #3b82f6)`,
          color: "#ffffff",
        }}
      >
        0
      </span>
    </Link>
  );
}
