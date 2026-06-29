import { BasePlugin } from "@/lib/plugin/basePlugin";
import type { PluginManifest, ApiRouter } from "@/lib/plugin/types";

const manifest: PluginManifest = {
  name: "social-share",
  version: "1.0.0",
  description:
    "Adds social share buttons (Twitter, LinkedIn, Copy Link) to the post view footer",
  author: "maddyBlog",
  license: "MIT",
  permissions: [],
  hooks: ["injectPostFooter", "registerRoutes"],
};

class SocialSharePlugin extends BasePlugin {
  manifest = manifest;

  constructor() {
    super();
    this.addUiHook("injectPostFooter", () => <SocialShareButtons />);
    this.addApiHook((router: ApiRouter) => {
      router.registerRoute({
        method: "GET",
        path: "/api/plugins/social-share/stats",
        handler: async () => {
          return Response.json({
            plugin: "social-share",
            version: "1.0.0",
            shares: 0,
          });
        },
      });
    });
  }

  async onInstall(): Promise<void> {
    console.log("[social-share] plugin installed");
  }

  async onActivate(): Promise<void> {
    console.log("[social-share] plugin activated");
  }

  async onDeactivate(): Promise<void> {
    console.log("[social-share] plugin deactivated");
  }
}

function SocialShareButtons() {
  const url = typeof window !== "undefined" ? window.location.href : "";
  const title = typeof window !== "undefined" ? document.title : "";

  const links = [
    {
      name: "𝕏",
      label: "Twitter",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    },
    {
      name: "in",
      label: "LinkedIn",
      href: `https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
    {
      name: "🔗",
      label: "Copy Link",
      href: "#",
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        navigator.clipboard.writeText(url).catch(() => {});
      },
    },
  ];

  return (
    <div className="flex items-center gap-3 mt-10 pt-6 border-t border-zinc-200 dark:border-zinc-800">
      <span className="text-sm font-medium text-zinc-500">Share</span>
      <div className="flex items-center gap-2">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target={link.href !== "#" ? "_blank" : undefined}
            rel="noopener noreferrer"
            onClick={link.onClick}
            className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-700 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label={`Share on ${link.label}`}
          >
            {link.name}
          </a>
        ))}
      </div>
    </div>
  );
}

const plugin = new SocialSharePlugin();
export { plugin };
export default plugin;
