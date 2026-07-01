export type HeaderElementType =
  | "logo"
  | "nav-menu"
  | "search"
  | "social-icons"
  | "button"
  | "html"
  | "text"
  | "divider"
  | "spacer"
  | "cart-icon"
  | "language-switcher";

export type FooterElementType =
  | "copyright"
  | "nav-menu"
  | "social-icons"
  | "newsletter"
  | "text"
  | "html"
  | "divider"
  | "spacer"
  | "logo"
  | "back-to-top";

export type BuilderElementType = HeaderElementType | FooterElementType;

export type VisibilitySetting = {
  desktop: boolean;
  tablet: boolean;
  mobile: boolean;
};

export type AlignmentSetting = "start" | "center" | "end" | "stretch";

export interface BuilderElement {
  id: string;
  type: BuilderElementType;
  content?: string;
  link?: string;
  icon?: string;
  label?: string;
  className?: string;
  visibility: VisibilitySetting;
  settings: Record<string, unknown>;
}

export interface BuilderColumn {
  id: string;
  width: number;
  elements: BuilderElement[];
  className?: string;
  alignment?: AlignmentSetting;
}

export interface BuilderRow {
  id: string;
  columns: BuilderColumn[];
  className?: string;
  settings: {
    backgroundColor?: string;
    textColor?: string;
    height?: number;
    paddingY?: number;
    paddingX?: number;
    maxWidth?: string;
    borderBottom?: string;
    borderTop?: string;
    sticky?: boolean;
    visible: VisibilitySetting;
  };
}

export interface HeaderConfig {
  topRow: BuilderRow | null;
  mainRow: BuilderRow;
  bottomRow: BuilderRow | null;
  settings: {
    sticky: boolean;
    stickyOnMobile: boolean;
    transparent: boolean;
    height: number;
    backgroundColor: string;
    textColor: string;
    borderBottom: string;
    boxShadow: string;
  };
}

export interface FooterConfig {
  rows: BuilderRow[];
  settings: {
    backgroundColor: string;
    textColor: string;
    borderTop: string;
    paddingTop: number;
    paddingBottom: number;
  };
}

export type BuilderSectionType = "header" | "footer";

export interface BuilderPreset {
  id: string;
  label: string;
  header: HeaderConfig;
  footer: FooterConfig;
}
