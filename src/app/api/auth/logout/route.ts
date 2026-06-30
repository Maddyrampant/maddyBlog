import { clearSession } from "@/lib/jwt";
import { NextResponse } from "next/server";

export async function POST() {
  await clearSession();
  return NextResponse.json({ success: true });
}
