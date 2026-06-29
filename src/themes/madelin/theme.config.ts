import type { ThemeManifest, ThemeConfigValues } from "@/core/theme";

export const manifest: ThemeManifest = {
  name: "madelin",
  version: "1.0.0",
  author: "maddyBlog",
  description:
    "Madelin — an elegant, warm-toned theme with glassmorphism, gradient accents, and refined typography.",
  previewImage: "/themes/madelin/preview.png",
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
        key: "accent",
        label: "Accent Color",
        type: "color",
        defaultValue: "#d97706",
        description: "Main accent color for links, headings, and highlights",
      },
      {
        key: "accentLight",
        label: "Accent Light",
        type: "color",
        defaultValue: "#fef3c7",
        description: "Light accent background tint",
      },
      {
        key: "fontFamily",
        label: "Font Family",
        type: "font",
        defaultValue: "Inter",
        options: [
          { label: "Inter", value: "Inter" },
          { label: "Lora", value: "Lora" },
          { label: "Georgia", value: "Georgia" },
          { label: "System UI", value: "system-ui" },
        ],
      },
      {
        key: "layout",
        label: "Layout Style",
        type: "select",
        defaultValue: "elegant",
        options: [
          { label: "Elegant", value: "elegant" },
          { label: "Minimal", value: "minimal" },
          { label: "Wide", value: "wide" },
        ],
      },
      {
        key: "glassOpacity",
        label: "Glass Effect Opacity",
        type: "number",
        defaultValue: 0.6,
        description: "Opacity of glassmorphism cards (0-1)",
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
        fields: [
          "accent",
          "accentLight",
          "fontFamily",
          "layout",
          "glassOpacity",
        ],
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
  accent: "#d97706",
  accentLight: "#fef3c7",
  fontFamily: "Inter",
  layout: "elegant",
  glassOpacity: 0.6,
  showAuthorBox: true,
  showReadingTime: true,
  showRelatedPosts: true,
  maxPostsPerPage: 9,
};
