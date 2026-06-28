import { NextResponse } from "next/server";
import { getSession } from "@/lib/jwt";

export async function requireUser() {
  const session = await getSession();
  if (!session) {
    return { session: null, error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { session, error: null };
}

export async function requireAdminUser() {
  const result = await requireUser();
  if (result.error) return result;
  if (result.session.role !== "ADMIN") {
    return { session: null, error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return result;
}
