import { NextRequest } from "next/server";
import { getSession } from "@/lib/jwt";
import { pluginManager } from "@/lib/plugin";
import { errorResponse, AuthenticationError } from "@/lib/errors";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) throw new AuthenticationError();

    await pluginManager.initialize();

    const entries = pluginManager.getEntries();
    const plugins = Array.from(entries.entries()).map(([dir, entry]) => ({
      dir,
      name: entry.plugin?.manifest.name || dir,
      version: entry.plugin?.manifest.version || "0.0.0",
      description: entry.plugin?.manifest.description || "",
      author: entry.plugin?.manifest.author || "",
      status: entry.status,
      error: entry.error || null,
      permissions: entry.plugin?.manifest.permissions || [],
    }));

    return Response.json({ plugins });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) throw new AuthenticationError();

    const body = await request.json();
    const { name, action } = body;

    if (!name || !action) {
      return Response.json(
        { error: "name and action are required" },
        { status: 400 },
      );
    }

    await pluginManager.initialize();

    let success = false;
    switch (action) {
      case "activate":
        success = await pluginManager.activate(name);
        break;
      case "deactivate":
        success = await pluginManager.deactivate(name);
        break;
      case "uninstall":
        success = await pluginManager.uninstall(name);
        break;
      default:
        return Response.json(
          { error: `Unknown action: ${action}` },
          { status: 400 },
        );
    }

    return Response.json({ success });
  } catch (error) {
    return errorResponse(error);
  }
}
