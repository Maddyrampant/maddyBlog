import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret");
const COOKIE_NAME = "session";

export type SessionPayload = {
  userId: string;
  email: string;
  role: "USER" | "ADMIN";
};

export async function createSession(payload: SessionPayload): Promise<string> {
  const token = await new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .setIssuedAt()
    .sign(SECRET);

  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return token;
}

export async function verifySession(): Promise<SessionPayload | null> {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function requireAuth(): Promise<SessionPayload> {
  const session = await verifySession();
  if (!session) redirect("/login");
  return session;
}

export async function requireAdmin(): Promise<SessionPayload> {
  const session = await requireAuth();
  if (session.role !== "ADMIN") redirect("/");
  return session;
}

export async function clearSession(): Promise<void> {
  (await cookies()).delete(COOKIE_NAME);
}
