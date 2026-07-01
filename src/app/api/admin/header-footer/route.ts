import { NextResponse } from "next/server";
import {
  loadConfig,
  saveHeaderFooterConfig,
  getDefaultConfig,
} from "@/lib/header-footer/storage";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const theme = searchParams.get("theme") ?? "default";
  const config = await loadConfig(theme);
  return NextResponse.json(config);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { theme, header, footer } = body;
  if (!theme || !header || !footer) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }
  const ok = await saveHeaderFooterConfig(theme, header, footer);
  return NextResponse.json({ success: ok });
}

export async function PUT(req: Request) {
  const { searchParams } = new URL(req.url);
  const theme = searchParams.get("theme") ?? "default";
  const config = getDefaultConfig(theme);
  await saveHeaderFooterConfig(theme, config.header, config.footer);
  return NextResponse.json(config);
}
