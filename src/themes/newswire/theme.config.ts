import type { ThemeManifest, ThemeConfigValues } from "@/core/theme";

export const manifest: ThemeManifest = {
  name: "newswire",
  version: "1.0.0",
  author: "maddyBlog",
  description:
    "NewsWire — a professional news magazine theme with bold headlines, red/blue accents, hierarchical layouts, and a breaking-news ticker. Built for editorial content and current events.",
  previewImage: "/themes/newswire/preview.png",
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
        defaultValue: "#dc2626",
        description: "Primary accent color (red) for headlines and CTAs",
      },
      {
        key: "accentColor",
        label: "Accent Color",
        type: "color",
        defaultValue: "#2563eb",
        description: "Secondary accent color (blue) for links and highlights",
      },
      {
        key: "fontFamily",
        label: "Font Family",
        type: "font",
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
        defaultValue: "magazine",
        options: [
          { label: "Classic", value: "classic" },
          { label: "Compact", value: "compact" },
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
        defaultValue: 12,
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
  primaryColor: "#dc2626",
  accentColor: "#2563eb",
  fontFamily: "Inter",
  layout: "magazine",
  showAuthorBox: true,
  showReadingTime: true,
  showRelatedPosts: true,
  maxPostsPerPage: 12,
};
