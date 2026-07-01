import type { ThemeManifest, ThemeConfigValues } from "@/core/theme";

export const manifest: ThemeManifest = {
  name: "personalblog",
  version: "1.0.0",
  author: "maddyBlog",
  description:
    "PersonalBlog — a warm, minimal, typography-first theme for personal writers. Clean sans-serif body, elegant serif headings, soft colors, and plenty of whitespace.",
  previewImage: "/themes/personalblog/preview.png",
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
        defaultValue: "#b45309",
        description: "Main accent color for links, headings, and highlights",
      },
      {
        key: "fontFamily",
        label: "Font Family",
        type: "select",
        defaultValue: "Lora",
        options: [
          { label: "Lora", value: "Lora" },
          { label: "Merriweather", value: "Merriweather" },
          { label: "Georgia", value: "Georgia" },
          { label: "Inter", value: "Inter" },
        ],
      },
      {
        key: "layout",
        label: "Layout Style",
        type: "select",
        defaultValue: "classic",
        options: [
          { label: "Classic", value: "classic" },
          { label: "Wide", value: "wide" },
          { label: "Compact", value: "compact" },
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
        fields: ["primaryColor", "fontFamily", "layout"],
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
  primaryColor: "#b45309",
  fontFamily: "Lora",
  layout: "classic",
  showAuthorBox: true,
  showReadingTime: true,
  showRelatedPosts: true,
  maxPostsPerPage: 9,
};
