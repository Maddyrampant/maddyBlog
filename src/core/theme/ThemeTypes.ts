import type { ReactNode } from "react";

export type ThemeStatus = "inactive" | "active" | "error";

export type ThemeManifest = {
  name: string;
  version: string;
  author: string;
  description: string;
  previewImage?: string;
  license?: string;
  supportedFeatures: ThemeSupportedFeature[];
  configurationSchema: ThemeConfigSchema;
};

export type ThemeSupportedFeature =
  | "author-card"
  | "related-posts"
  | "sidebar"
  | "newsletter"
  | "search"
  | "categories"
  | "tags"
  | "reading-time"
  | "social-share"
  | "dark-mode"
  | "stories"
  | "featured-slider"
  | "category-sections";

export type ThemeConfigFieldType =
  "text" | "color" | "select" | "number" | "boolean" | "font";

export type ThemeConfigField = {
  key: string;
  label: string;
  type: ThemeConfigFieldType;
  defaultValue: string | number | boolean;
  options?: { label: string; value: string }[];
  description?: string;
};

export type ThemeConfigSchema = {
  fields: ThemeConfigField[];
  groups?: ThemeConfigGroup[];
};

export type ThemeConfigGroup = {
  label: string;
  key: string;
  fields: string[];
};

export type ThemeConfigValues = Record<string, string | number | boolean>;

export type ThemeComponentName =
  | "Layout"
  | "PostPage"
  | "HomePage"
  | "Header"
  | "Footer"
  | "AuthorCard"
  | "RelatedPosts"
  | "Sidebar"
  | "NewsletterSignup"
  | "PostCard"
  | "CategoryBadge"
  | "TagBadge"
  | "ReadingTime"
  | "SearchBar"
  | "Pagination"
  | "CommentList"
  | "CommentForm";

export type ThemeComponentType = "required" | "optional";

export const THEME_REQUIRED_COMPONENTS: ThemeComponentName[] = [
  "Layout",
  "PostPage",
  "HomePage",
  "Header",
  "Footer",
];

export const THEME_OPTIONAL_COMPONENTS: ThemeComponentName[] = [
  "AuthorCard",
  "RelatedPosts",
  "Sidebar",
  "NewsletterSignup",
  "PostCard",
  "CategoryBadge",
  "TagBadge",
  "ReadingTime",
  "SearchBar",
  "Pagination",
  "CommentList",
  "CommentForm",
];

export type ThemeComponent = {
  name: ThemeComponentName;
  type: ThemeComponentType;
  component: () => ReactNode | Promise<ReactNode>;
};

export type ThemeEntry = {
  manifest: ThemeManifest;
  status: ThemeStatus;
  config: ThemeConfigValues;
  error?: string;
  installedAt: Date;
  directory: string;
};

export type ThemeEvent = {
  type: string;
  payload: unknown;
  timestamp: Date;
  source: string;
};

export type ThemePageProps = {
  params?: Record<string, string | string[]>;
  searchParams?: Record<string, string | string[]>;
  children?: ReactNode;
};
