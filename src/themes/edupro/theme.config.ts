import type { ThemeManifest, ThemeConfigValues } from "@/core/theme";

export const manifest: ThemeManifest = {
  name: "edupro",
  version: "1.0.0",
  author: "maddyBlog",
  description:
    "EduPro — a clean, focused learning theme with academic green/blue accents, card-based course layouts, progress indicators, and readability-optimized typography. Built for tutorials and educational content.",
  supportedFeatures: [
    "author-card",
    "related-posts",
    "sidebar",
    "newsletter",
    "search",
    "categories",
    "tags",
    "reading-time",
    "dark-mode",
  ],
  configurationSchema: {
    fields: [
      {
        key: "primaryColor",
        label: "Primary Color",
        type: "color",
        defaultValue: "#059669",
        description: "Main accent color for links, headings, and highlights",
      },
      {
        key: "accentColor",
        label: "Accent Color",
        type: "color",
        defaultValue: "#3b82f6",
        description: "Secondary accent color for interactive elements",
      },
      {
        key: "fontFamily",
        label: "Font Family",
        type: "select",
        defaultValue: "Inter",
        options: [
          { label: "Inter", value: "Inter" },
          { label: "Merriweather", value: "Merriweather" },
          { label: "Georgia", value: "Georgia" },
          { label: "System UI", value: "system-ui" },
        ],
      },
      {
        key: "layout",
        label: "Layout Style",
        type: "select",
        defaultValue: "card",
        options: [
          { label: "Grid", value: "grid" },
          { label: "List", value: "list" },
          { label: "Card", value: "card" },
        ],
      },
      {
        key: "showAuthorBox",
        label: "Show Author Box",
        type: "boolean",
        defaultValue: true,
      },
      {
        key: "showReadingTime",
        label: "Show Reading Time",
        type: "boolean",
        defaultValue: true,
      },
      {
        key: "showRelatedPosts",
        label: "Show Related Posts",
        type: "boolean",
        defaultValue: true,
      },
      {
        key: "maxPostsPerPage",
        label: "Posts Per Page",
        type: "number",
        defaultValue: 9,
        description: "Number of posts to show on the homepage",
      },
    ],
    groups: [
      {
        label: "Appearance",
        key: "appearance",
        fields: ["primaryColor", "accentColor", "fontFamily", "layout"],
      },
      {
        label: "Content",
        key: "content",
        fields: [
          "showAuthorBox",
          "showReadingTime",
          "showRelatedPosts",
          "maxPostsPerPage",
        ],
      },
    ],
  },
};

export const defaultConfig: ThemeConfigValues = {
  primaryColor: "#059669",
  accentColor: "#3b82f6",
  fontFamily: "Inter",
  layout: "card",
  showAuthorBox: true,
  showReadingTime: true,
  showRelatedPosts: true,
  maxPostsPerPage: 9,
};
