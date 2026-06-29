import { NextRequest } from "next/server";
import { getSession } from "@/lib/jwt";
import { AuthenticationError, errorResponse } from "@/lib/errors";
import { themeManager, themeRegistry } from "@/core/theme";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) throw new AuthenticationError();

    await themeManager.initialize();

    const entries = themeManager.getEntries();
    const activeTheme = themeRegistry.getActiveThemeName();

    const themes = Array.from(entries.entries()).map(([name, entry]) => ({
      name,
      version: entry.manifest.version,
      author: entry.manifest.author,
      description: entry.manifest.description,
      previewImage: entry.manifest.previewImage ?? null,
      status: entry.status,
      error: entry.error ?? null,
      config: entry.config,
      schema: entry.manifest.configurationSchema,
      supportedFeatures: entry.manifest.supportedFeatures,
      active: name === activeTheme,
      installedAt: entry.installedAt,
    }));

    return Response.json({ themes, activeTheme });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) throw new AuthenticationError();

    const body = await request.json();
    const { name, action, config } = body;

    if (!name || !action) {
      return Response.json(
        { error: "name and action are required" },
        { status: 400 },
      );
    }

    await themeManager.initialize();

    switch (action) {
      case "activate": {
        const success = await themeManager.activate(name);
        return Response.json({ success, activeTheme: name });
      }
      case "deactivate": {
        const success = await themeManager.deactivate(name);
        return Response.json({ success });
      }
      case "uninstall": {
        const success = await themeManager.uninstall(name);
        return Response.json({ success });
      }
      case "configure": {
        if (!config || typeof config !== "object") {
          return Response.json(
            { error: "config object is required for configure action" },
            { status: 400 },
          );
        }
        themeManager.updateConfig(name, config);
        return Response.json({ success: true, config });
      }
      default:
        return Response.json(
          { error: `Unknown action: ${action}` },
          { status: 400 },
        );
    }
  } catch (error) {
    return errorResponse(error);
  }
}
