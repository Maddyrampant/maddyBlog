import { NextResponse } from "next/server";
import { register, login } from "./authService";

export async function handleRegister(request: Request) {
  try {
    const body = await request.json();
    const user = await register(body);
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Registration failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function handleLogin(request: Request) {
  try {
    const body = await request.json();
    const user = await login(body);
    return NextResponse.json(user);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
