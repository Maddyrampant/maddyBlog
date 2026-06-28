import { NextResponse } from "next/server";
import { registerUser } from "@/services/auth.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const user = await registerUser(body);
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Registration failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
