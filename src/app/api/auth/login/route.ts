import { NextResponse } from "next/server";
import { loginUser } from "@/services/auth.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const user = await loginUser(body);
    return NextResponse.json(user);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
