import type { HeaderConfig, FooterConfig, BuilderPreset } from "./types";

function defaultHeader(siteName: string): HeaderConfig {
  return {
    topRow: null,
    mainRow: {
      id: "main",
      columns: [
        {
          id: "col-logo",
          width: 3,
          alignment: "start",
          elements: [
            {
              id: "logo",
              type: "logo",
              content: siteName,
              visibility: { desktop: true, tablet: true, mobile: true },
              settings: {},
            },
          ],
        },
        {
          id: "col-nav",
          width: 6,
          alignment: "center",
          elements: [
            {
              id: "nav",
              type: "nav-menu",
              content: "Home,Admin",
              visibility: { desktop: true, tablet: true, mobile: false },
              settings: {},
            },
          ],
        },
        {
          id: "col-search",
          width: 3,
          alignment: "end",
          elements: [
            {
              id: "search",
              type: "search",
              visibility: { desktop: true, tablet: false, mobile: false },
              settings: {},
            },
          ],
        },
      ],
      settings: {
        backgroundColor: "transparent",
        height: 64,
        paddingY: 16,
        maxWidth: "1200px",
        visible: { desktop: true, tablet: true, mobile: true },
      },
    },
    bottomRow: null,
    settings: {
      sticky: true,
      stickyOnMobile: false,
      transparent: false,
      height: 64,
      backgroundColor: "transparent",
      textColor: "inherit",
      borderBottom: "1px solid var(--border-color, #e5e7eb)",
      boxShadow: "none",
    },
  };
}

function defaultFooter(siteName: string): FooterConfig {
  return {
    rows: [
      {
        id: "footer-main",
        columns: [
          {
            id: "footer-col-1",
            width: 4,
            alignment: "start",
            elements: [
              {
                id: "footer-logo",
                type: "logo",
                content: siteName,
                visibility: { desktop: true, tablet: true, mobile: true },
                settings: {},
              },
              {
                id: "footer-text",
                type: "text",
                content: "Built with passion and persistence.",
                visibility: { desktop: true, tablet: true, mobile: true },
                settings: {},
              },
            ],
          },
          {
            id: "footer-col-2",
            width: 4,
            alignment: "center",
            elements: [
              {
                id: "footer-nav",
                type: "nav-menu",
                content: "Home,Admin",
                visibility: { desktop: true, tablet: true, mobile: true },
                settings: {},
              },
            ],
          },
          {
            id: "footer-col-3",
            width: 4,
            alignment: "end",
            elements: [
              {
                id: "footer-social",
                type: "social-icons",
                visibility: { desktop: true, tablet: true, mobile: true },
                settings: {},
              },
            ],
          },
        ],
        settings: {
          paddingY: 32,
          maxWidth: "1200px",
          visible: { desktop: true, tablet: true, mobile: true },
        },
      },
      {
        id: "footer-bottom",
        columns: [
          {
            id: "footer-bottom-col",
            width: 12,
            alignment: "center",
            elements: [
              {
                id: "copyright",
                type: "copyright",
                content: `© ${new Date().getFullYear()} ${siteName}. All rights reserved.`,
                visibility: { desktop: true, tablet: true, mobile: true },
                settings: {},
              },
            ],
          },
        ],
        settings: {
          paddingY: 16,
          maxWidth: "1200px",
          borderTop: "1px solid var(--border-color, #e5e7eb)",
          visible: { desktop: true, tablet: true, mobile: true },
        },
      },
    ],
    settings: {
      backgroundColor: "transparent",
      textColor: "inherit",
      borderTop: "none",
      paddingTop: 0,
      paddingBottom: 0,
    },
  };
}

export const themePresets: Record<string, BuilderPreset> = {
  default: {
    id: "default",
    label: "Default",
    header: defaultHeader("maddyBlog"),
    footer: defaultFooter("maddyBlog"),
  },
  madelin: {
    id: "madelin",
    label: "Madelin",
    header: {
      topRow: null,
      mainRow: {
        id: "main",
        columns: [
          {
            id: "col-logo",
            width: 4,
            alignment: "start",
            elements: [
              {
                id: "logo",
                type: "logo",
                content: "Madelin",
                visibility: { desktop: true, tablet: true, mobile: true },
                settings: {},
              },
            ],
          },
          {
            id: "col-nav",
            width: 8,
            alignment: "end",
            elements: [
              {
                id: "nav",
                type: "nav-menu",
                content: "Home,Admin",
                visibility: { desktop: true, tablet: true, mobile: false },
                settings: {},
              },
            ],
          },
        ],
        settings: {
          backgroundColor: "transparent",
          height: 64,
          paddingY: 16,
          maxWidth: "1200px",
          visible: { desktop: true, tablet: true, mobile: true },
        },
      },
      bottomRow: null,
      settings: {
        sticky: true,
        stickyOnMobile: false,
        transparent: false,
        height: 64,
        backgroundColor: "transparent",
        textColor: "inherit",
        borderBottom: "none",
        boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
      },
    },
    footer: defaultFooter("Madelin"),
  },
  zoomg: {
    id: "zoomg",
    label: "Zoomg",
    header: {
      topRow: {
        id: "top",
        columns: [
          {
            id: "top-col",
            width: 12,
            alignment: "center",
            elements: [
              {
                id: "top-text",
                type: "text",
                content: "🔥 Breaking: New content every day!",
                visibility: { desktop: true, tablet: true, mobile: false },
                settings: { fontSize: "12px" },
              },
            ],
          },
        ],
        settings: {
          backgroundColor: "#1e293b",
          textColor: "#ffffff",
          height: 32,
          paddingY: 6,
          borderBottom: "none",
          visible: { desktop: true, tablet: true, mobile: false },
        },
      },
      mainRow: {
        id: "main",
        columns: [
          {
            id: "col-logo",
            width: 2,
            alignment: "start",
            elements: [
              {
                id: "logo",
                type: "logo",
                content: "Zoomg",
                visibility: { desktop: true, tablet: true, mobile: true },
                settings: {},
              },
            ],
          },
          {
            id: "col-nav",
            width: 7,
            alignment: "center",
            elements: [
              {
                id: "nav",
                type: "nav-menu",
                content: "Home,Admin",
                visibility: { desktop: true, tablet: true, mobile: false },
                settings: {},
              },
            ],
          },
          {
            id: "col-search",
            width: 3,
            alignment: "end",
            elements: [
              {
                id: "search",
                type: "search",
                visibility: { desktop: true, tablet: false, mobile: false },
                settings: {},
              },
            ],
          },
        ],
        settings: {
          backgroundColor: "#0f172a",
          textColor: "#e2e8f0",
          height: 64,
          paddingY: 16,
          maxWidth: "1200px",
          visible: { desktop: true, tablet: true, mobile: true },
        },
      },
      bottomRow: null,
      settings: {
        sticky: true,
        stickyOnMobile: true,
        transparent: false,
        height: 64,
        backgroundColor: "#0f172a",
        textColor: "#e2e8f0",
        borderBottom: "1px solid #1e293b",
        boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
      },
    },
    footer: {
      rows: [
        {
          id: "footer-main",
          columns: [
            {
              id: "fc1",
              width: 4,
              alignment: "start",
              elements: [
                {
                  id: "flogo",
                  type: "logo",
                  content: "Zoomg",
                  visibility: { desktop: true, tablet: true, mobile: true },
                  settings: {},
                },
                {
                  id: "ftext",
                  type: "text",
                  content: "Your gaming & tech destination.",
                  visibility: { desktop: true, tablet: true, mobile: true },
                  settings: {},
                },
              ],
            },
            {
              id: "fc2",
              width: 4,
              alignment: "center",
              elements: [
                {
                  id: "fnav",
                  type: "nav-menu",
                  content: "Home,Admin",
                  visibility: { desktop: true, tablet: true, mobile: true },
                  settings: {},
                },
              ],
            },
            {
              id: "fc3",
              width: 4,
              alignment: "end",
              elements: [
                {
                  id: "fsocial",
                  type: "social-icons",
                  visibility: { desktop: true, tablet: true, mobile: true },
                  settings: {},
                },
              ],
            },
          ],
          settings: {
            paddingY: 32,
            maxWidth: "1200px",
            visible: { desktop: true, tablet: true, mobile: true },
          },
        },
        {
          id: "footer-bottom",
          columns: [
            {
              id: "fbc",
              width: 12,
              alignment: "center",
              elements: [
                {
                  id: "fcopy",
                  type: "copyright",
                  content: `© ${new Date().getFullYear()} Zoomg. All rights reserved.`,
                  visibility: { desktop: true, tablet: true, mobile: true },
                  settings: {},
                },
              ],
            },
          ],
          settings: {
            paddingY: 16,
            maxWidth: "1200px",
            borderTop: "1px solid #1e293b",
            visible: { desktop: true, tablet: true, mobile: true },
          },
        },
      ],
      settings: {
        backgroundColor: "#0f172a",
        textColor: "#94a3b8",
        borderTop: "none",
        paddingTop: 0,
        paddingBottom: 0,
      },
    },
  },
  zoomji: {
    id: "zoomji",
    label: "Zoomji",
    header: defaultHeader("Zoomji"),
    footer: defaultFooter("Zoomji"),
  },
  digitech: {
    id: "digitech",
    label: "DigiTech",
    header: {
      topRow: null,
      mainRow: {
        id: "main",
        columns: [
          {
            id: "col-logo",
            width: 2,
            alignment: "start",
            elements: [
              {
                id: "logo",
                type: "logo",
                content: "DigiTech",
                visibility: { desktop: true, tablet: true, mobile: true },
                settings: {},
              },
            ],
          },
          {
            id: "col-nav",
            width: 7,
            alignment: "center",
            elements: [
              {
                id: "nav",
                type: "nav-menu",
                content: "Home,Admin",
                visibility: { desktop: true, tablet: true, mobile: false },
                settings: {},
              },
            ],
          },
          {
            id: "col-search",
            width: 3,
            alignment: "end",
            elements: [
              {
                id: "search",
                type: "search",
                visibility: { desktop: true, tablet: false, mobile: false },
                settings: {},
              },
            ],
          },
        ],
        settings: {
          backgroundColor: "transparent",
          height: 64,
          paddingY: 16,
          maxWidth: "1200px",
          visible: { desktop: true, tablet: true, mobile: true },
        },
      },
      bottomRow: null,
      settings: {
        sticky: true,
        stickyOnMobile: true,
        transparent: false,
        height: 64,
        backgroundColor: "#0a0a0f",
        textColor: "#e4e4e7",
        borderBottom: "1px solid #27272a",
        boxShadow: "none",
      },
    },
    footer: defaultFooter("DigiTech"),
  },
  gameverse: {
    id: "gameverse",
    label: "GameVerse",
    header: {
      topRow: null,
      mainRow: {
        id: "main",
        columns: [
          {
            id: "col-logo",
            width: 2,
            alignment: "start",
            elements: [
              {
                id: "logo",
                type: "logo",
                content: "GameVerse",
                visibility: { desktop: true, tablet: true, mobile: true },
                settings: {},
              },
            ],
          },
          {
            id: "col-nav",
            width: 7,
            alignment: "center",
            elements: [
              {
                id: "nav",
                type: "nav-menu",
                content: "Home,Admin,Reviews",
                visibility: { desktop: true, tablet: true, mobile: false },
                settings: {},
              },
            ],
          },
          {
            id: "col-search",
            width: 3,
            alignment: "end",
            elements: [
              {
                id: "search",
                type: "search",
                visibility: { desktop: true, tablet: false, mobile: false },
                settings: {},
              },
            ],
          },
        ],
        settings: {
          backgroundColor: "transparent",
          height: 64,
          paddingY: 16,
          maxWidth: "1200px",
          visible: { desktop: true, tablet: true, mobile: true },
        },
      },
      bottomRow: null,
      settings: {
        sticky: true,
        stickyOnMobile: true,
        transparent: false,
        height: 64,
        backgroundColor: "#0f0a1a",
        textColor: "#e4e2ed",
        borderBottom: "1px solid #2a1f45",
        boxShadow: "0 4px 24px rgba(168,85,247,0.1)",
      },
    },
    footer: defaultFooter("GameVerse"),
  },
  personalblog: {
    id: "personalblog",
    label: "PersonalBlog",
    header: {
      topRow: null,
      mainRow: {
        id: "main",
        columns: [
          {
            id: "col-logo",
            width: 4,
            alignment: "start",
            elements: [
              {
                id: "logo",
                type: "logo",
                content: "PersonalBlog",
                visibility: { desktop: true, tablet: true, mobile: true },
                settings: {},
              },
            ],
          },
          {
            id: "col-nav",
            width: 8,
            alignment: "end",
            elements: [
              {
                id: "nav",
                type: "nav-menu",
                content: "Home,Admin,About",
                visibility: { desktop: true, tablet: true, mobile: false },
                settings: {},
              },
            ],
          },
        ],
        settings: {
          backgroundColor: "transparent",
          height: 64,
          paddingY: 16,
          maxWidth: "800px",
          visible: { desktop: true, tablet: true, mobile: true },
        },
      },
      bottomRow: null,
      settings: {
        sticky: true,
        stickyOnMobile: false,
        transparent: false,
        height: 64,
        backgroundColor: "#faf9f6",
        textColor: "#1c1917",
        borderBottom: "1px solid #e7e5e4",
        boxShadow: "none",
      },
    },
    footer: defaultFooter("PersonalBlog"),
  },
  newswire: {
    id: "newswire",
    label: "NewsWire",
    header: {
      topRow: {
        id: "breaking",
        columns: [
          {
            id: "breaking-col",
            width: 12,
            alignment: "center",
            elements: [
              {
                id: "breaking-text",
                type: "text",
                content:
                  "📰 Breaking News: Stay informed with the latest updates.",
                visibility: { desktop: true, tablet: true, mobile: false },
                settings: { fontSize: "13px", fontWeight: "600" },
              },
            ],
          },
        ],
        settings: {
          backgroundColor: "#dc2626",
          textColor: "#ffffff",
          height: 32,
          paddingY: 6,
          visible: { desktop: true, tablet: true, mobile: false },
        },
      },
      mainRow: {
        id: "main",
        columns: [
          {
            id: "col-logo",
            width: 3,
            alignment: "start",
            elements: [
              {
                id: "logo",
                type: "logo",
                content: "NewsWire",
                visibility: { desktop: true, tablet: true, mobile: true },
                settings: {},
              },
            ],
          },
          {
            id: "col-nav",
            width: 6,
            alignment: "center",
            elements: [
              {
                id: "nav",
                type: "nav-menu",
                content: "Home,Admin,World,Tech",
                visibility: { desktop: true, tablet: true, mobile: false },
                settings: {},
              },
            ],
          },
          {
            id: "col-search",
            width: 3,
            alignment: "end",
            elements: [
              {
                id: "search",
                type: "search",
                visibility: { desktop: true, tablet: false, mobile: false },
                settings: {},
              },
            ],
          },
        ],
        settings: {
          backgroundColor: "#ffffff",
          textColor: "#0f172a",
          height: 64,
          paddingY: 16,
          maxWidth: "1200px",
          visible: { desktop: true, tablet: true, mobile: true },
        },
      },
      bottomRow: null,
      settings: {
        sticky: true,
        stickyOnMobile: true,
        transparent: false,
        height: 64,
        backgroundColor: "#ffffff",
        textColor: "#0f172a",
        borderBottom: "2px solid #dc2626",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      },
    },
    footer: defaultFooter("NewsWire"),
  },
  edupro: {
    id: "edupro",
    label: "EduPro",
    header: {
      topRow: null,
      mainRow: {
        id: "main",
        columns: [
          {
            id: "col-logo",
            width: 3,
            alignment: "start",
            elements: [
              {
                id: "logo",
                type: "logo",
                content: "EduPro",
                visibility: { desktop: true, tablet: true, mobile: true },
                settings: {},
              },
            ],
          },
          {
            id: "col-nav",
            width: 6,
            alignment: "center",
            elements: [
              {
                id: "nav",
                type: "nav-menu",
                content: "Home,Admin,Courses",
                visibility: { desktop: true, tablet: true, mobile: false },
                settings: {},
              },
            ],
          },
          {
            id: "col-search",
            width: 3,
            alignment: "end",
            elements: [
              {
                id: "search",
                type: "search",
                visibility: { desktop: true, tablet: false, mobile: false },
                settings: {},
              },
            ],
          },
        ],
        settings: {
          backgroundColor: "transparent",
          height: 64,
          paddingY: 16,
          maxWidth: "1200px",
          visible: { desktop: true, tablet: true, mobile: true },
        },
      },
      bottomRow: null,
      settings: {
        sticky: true,
        stickyOnMobile: false,
        transparent: false,
        height: 64,
        backgroundColor: "#f8fafc",
        textColor: "#0f172a",
        borderBottom: "3px solid #059669",
        boxShadow: "0 2px 8px rgba(5,150,105,0.1)",
      },
    },
    footer: defaultFooter("EduPro"),
  },
};
