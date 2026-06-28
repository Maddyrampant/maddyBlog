import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession, clearSession } from "@/lib/auth";
import { loginSchema, registerSchema, type LoginInput, type RegisterInput } from "@/validations/auth";

export async function registerUser(input: RegisterInput) {
  const data = registerSchema.parse(input);

  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    throw new Error("Email already in use");
  }

  const hashedPassword = await bcrypt.hash(data.password, 12);

  const user = await prisma.user.create({
    data: {
      username: data.username,
      email: data.email,
      passwordHash: hashedPassword,
    },
  });

  await createSession({ userId: user.id, email: user.email, role: user.role });

  return { id: user.id, username: user.username, email: user.email };
}

export async function loginUser(input: LoginInput) {
  const data = loginSchema.parse(input);

  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const valid = await bcrypt.compare(data.password, user.passwordHash);
  if (!valid) {
    throw new Error("Invalid credentials");
  }

  await createSession({ userId: user.id, email: user.email, role: user.role });

  return { id: user.id, username: user.username, email: user.email, role: user.role };
}

export async function logoutUser() {
  await clearSession();
}
