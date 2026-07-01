"use client";

import type {
  BuilderElementType,
  BuilderElement,
  BuilderColumn,
  BuilderRow,
  VisibilitySetting,
} from "@/lib/header-footer/types";

export function generateId(): string {
  return crypto.randomUUID?.() ?? Math.random().toString(36).substring(2, 11);
}

export function createElement(type: BuilderElementType): BuilderElement {
  const base: Omit<BuilderElement, "content"> = {
    id: generateId(),
    type,
    visibility: { desktop: true, tablet: true, mobile: true },
    settings: {},
  };

  switch (type) {
    case "logo":
      return { ...base, content: "Site Logo" };
    case "nav-menu":
      return { ...base, content: "Home,About,Contact" };
    case "button":
      return { ...base, content: "Click Me", link: "#" };
    case "text":
      return { ...base, content: "Text content" };
    case "html":
      return { ...base, content: "<p>Custom HTML</p>" };
    case "copyright":
      return { ...base, content: "© 2026 All rights reserved." };
    case "newsletter":
      return { ...base, content: "Subscribe" };
    default:
      return { ...base, content: undefined };
  }
}

export function createColumn(
  width = 12,
  elements?: BuilderElement[],
): BuilderColumn {
  return {
    id: generateId(),
    width,
    elements: elements ?? [],
    alignment: "start",
  };
}

export function createRow(): BuilderRow {
  return {
    id: generateId(),
    columns: [createColumn(12)],
    settings: {
      visible: { desktop: true, tablet: true, mobile: true },
      height: 64,
      paddingY: 16,
    },
  };
}

export function moveElement<T>(
  arr: T[],
  fromIndex: number,
  toIndex: number,
): T[] {
  if (fromIndex === toIndex) return arr;
  const result = [...arr];
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  return result;
}

export interface ElementTypeInfo {
  type: BuilderElementType;
  label: string;
  icon: string;
}

export const availableHeaderElements: ElementTypeInfo[] = [
  { type: "logo", label: "Logo", icon: "🖼" },
  { type: "nav-menu", label: "Navigation Menu", icon: "☰" },
  { type: "search", label: "Search", icon: "🔍" },
  { type: "social-icons", label: "Social Icons", icon: "🌐" },
  { type: "button", label: "Button", icon: "🔘" },
  { type: "html", label: "Custom HTML", icon: "📄" },
  { type: "text", label: "Text", icon: "📝" },
  { type: "divider", label: "Divider", icon: "➖" },
  { type: "spacer", label: "Spacer", icon: "▬" },
  { type: "cart-icon", label: "Cart Icon", icon: "🛒" },
  { type: "language-switcher", label: "Language Switcher", icon: "🌍" },
];

export const availableFooterElements: ElementTypeInfo[] = [
  { type: "copyright", label: "Copyright", icon: "©" },
  { type: "nav-menu", label: "Navigation Menu", icon: "☰" },
  { type: "social-icons", label: "Social Icons", icon: "🌐" },
  { type: "newsletter", label: "Newsletter", icon: "📧" },
  { type: "text", label: "Text", icon: "📝" },
  { type: "html", label: "Custom HTML", icon: "📄" },
  { type: "divider", label: "Divider", icon: "➖" },
  { type: "spacer", label: "Spacer", icon: "▬" },
  { type: "logo", label: "Logo", icon: "🖼" },
  { type: "back-to-top", label: "Back to Top", icon: "⬆" },
];

export function defaultVisibility(): VisibilitySetting {
  return { desktop: true, tablet: true, mobile: true };
}
