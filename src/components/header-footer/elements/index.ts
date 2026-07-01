import type { BuilderElement } from "@/lib/header-footer/types";
import LogoElement from "./LogoElement";
import NavMenuElement from "./NavMenuElement";
import SearchElement from "./SearchElement";
import SocialIconsElement from "./SocialIconsElement";
import ButtonElement from "./ButtonElement";
import TextElement from "./TextElement";
import HTMLElement from "./HTMLElement";
import DividerElement from "./DividerElement";
import SpacerElement from "./SpacerElement";
import CopyrightElement from "./CopyrightElement";
import NewsletterElement from "./NewsletterElement";
import BackToTopElement from "./BackToTopElement";

export const elementRenderers: Record<
  string,
  React.ComponentType<{ element: BuilderElement; themeName: string }>
> = {
  logo: LogoElement,
  "nav-menu": NavMenuElement,
  search: SearchElement,
  "social-icons": SocialIconsElement,
  button: ButtonElement,
  text: TextElement,
  html: HTMLElement,
  divider: DividerElement,
  spacer: SpacerElement,
  copyright: CopyrightElement,
  newsletter: NewsletterElement,
  "back-to-top": BackToTopElement,
};

export { default as LogoElement } from "./LogoElement";
export { default as NavMenuElement } from "./NavMenuElement";
export { default as SearchElement } from "./SearchElement";
export { default as SocialIconsElement } from "./SocialIconsElement";
export { default as ButtonElement } from "./ButtonElement";
export { default as TextElement } from "./TextElement";
export { default as HTMLElement } from "./HTMLElement";
export { default as DividerElement } from "./DividerElement";
export { default as SpacerElement } from "./SpacerElement";
export { default as CopyrightElement } from "./CopyrightElement";
export { default as NewsletterElement } from "./NewsletterElement";
export { default as BackToTopElement } from "./BackToTopElement";
