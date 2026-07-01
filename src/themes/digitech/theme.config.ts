import type { ThemeManifest, ThemeConfigValues } from "@/core/theme";

export const manifest: ThemeManifest = {
  name: "digitech",
  version: "1.0.0",
  author: "maddyBlog",
  description:
    "DigiTech — a dark-mode-first tech theme with neon accents, glassmorphism, and a futuristic reading experience. Inspired by top developer blogs.",
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
        defaultValue: "#06b6d4",
        description: "Main accent color for links, headings, and highlights",
      },
      {
        key: "accentColor",
        label: "Accent Color",
        type: "color",
        defaultValue: "#22d3ee",
        description: "Neon accent color for interactive elements",
      },
      {
        key: "fontFamily",
        label: "Font Family",
        type: "select",
        defaultValue: "Inter",
        options: [
          { label: "Inter", value: "Inter" },
          { label: "JetBrains Mono", value: "JetBrains Mono" },
          { label: "System UI", value: "system-ui" },
        ],
      },
      {
        key: "layout",
        label: "Layout Style",
        type: "select",
        defaultValue: "grid",
        options: [
          { label: "Grid", value: "grid" },
          { label: "List", value: "list" },
          { label: "Magazine", value: "magazine" },
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
  primaryColor: "#06b6d4",
  accentColor: "#22d3ee",
  fontFamily: "Inter",
  layout: "grid",
  showAuthorBox: true,
  showReadingTime: true,
  showRelatedPosts: true,
  maxPostsPerPage: 9,
};
