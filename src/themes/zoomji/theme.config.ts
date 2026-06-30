import type { ThemeManifest, ThemeConfigValues } from "@/core/theme";

export const manifest: ThemeManifest = {
  name: "zoomji",
  version: "1.0.0",
  author: "maddyBlog",
  description: "Zoomji — a bold magazine-style portal theme with stories, featured carousel, and category-driven layouts.",
  previewImage: "/themes/zoomji/preview.png",
  supportedFeatures: [
    "stories",
    "featured-slider",
    "category-sections",
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
        defaultValue: "#2563eb",
        description: "Main accent color for links, headings, and highlights",
      },
      {
        key: "accentLight",
        label: "Accent Light",
        type: "color",
        defaultValue: "#dbeafe",
        description: "Light accent background tint",
      },
      {
        key: "fontFamily",
        label: "Font Family",
        type: "font",
        defaultValue: "Inter",
        options: [
          { label: "Inter", value: "Inter" },
          { label: "Playfair Display", value: "Playfair Display" },
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
          { label: "Magazine", value: "magazine" },
          { label: "Compact", value: "compact" },
          { label: "Grid", value: "grid" },
        ],
      },
      {
        key: "showStories",
        label: "Show Stories Bar",
        type: "boolean",
        defaultValue: true,
      },
      {
        key: "showFeaturedSlider",
        label: "Show Featured Slider",
        type: "boolean",
        defaultValue: true,
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
        fields: ["accent", "accentLight", "fontFamily", "layout"],
      },
      {
        label: "Sections",
        key: "sections",
        fields: ["showStories", "showFeaturedSlider"],
      },
      {
        label: "Content",
        key: "content",
        fields: ["showAuthorBox", "showReadingTime", "showRelatedPosts", "maxPostsPerPage"],
      },
    ],
  },
};

export const defaultConfig: ThemeConfigValues = {
  accent: "#2563eb",
  accentLight: "#dbeafe",
  fontFamily: "Inter",
  layout: "magazine",
  showStories: true,
  showFeaturedSlider: true,
  showAuthorBox: true,
  showReadingTime: true,
  showRelatedPosts: true,
  maxPostsPerPage: 12,
};
