import type { ThemeManifest, ThemeConfigValues } from "@/core/theme";

export const manifest: ThemeManifest = {
  name: "gameverse",
  version: "1.0.0",
  author: "maddyBlog",
  description:
    "GameVerse — an energetic gaming theme with cyberpunk vibes, purple-neon accents, bold gradients, and animated elements. Built for game reviews and esports coverage.",
  previewImage: "/themes/gameverse/preview.png",
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
        defaultValue: "#a855f7",
        description: "Primary purple accent color",
      },
      {
        key: "accentColor",
        label: "Accent Color",
        type: "color",
        defaultValue: "#c084fc",
        description: "Secondary accent color",
      },
      {
        key: "fontFamily",
        label: "Font Family",
        type: "font",
        defaultValue: "Inter",
        options: [
          { label: "Inter", value: "Inter" },
          { label: "Orbitron", value: "Orbitron" },
          { label: "System UI", value: "system-ui" },
        ],
      },
      {
        key: "layout",
        label: "Layout Style",
        type: "select",
        defaultValue: "gaming",
        options: [
          { label: "Gaming", value: "gaming" },
          { label: "Compact", value: "compact" },
          { label: "Wide", value: "wide" },
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
  primaryColor: "#a855f7",
  accentColor: "#c084fc",
  fontFamily: "Inter",
  layout: "gaming",
  showAuthorBox: true,
  showReadingTime: true,
  showRelatedPosts: true,
  maxPostsPerPage: 9,
};
