import { hashPassword, verifyPassword } from "@/lib/hash";
import { createSession } from "@/lib/jwt";
import {
  registerSchema,
  loginSchema,
  type RegisterInput,
  type LoginInput,
} from "@/validations/authSchema";
import * as authRepository from "./authRepository";
import { runHook } from "@/lib/plugin/hooksRunner";

export async function register(input: RegisterInput) {
  const data = registerSchema.parse(input);

  const existingEmail = await authRepository.findByEmail(data.email);
  if (existingEmail) {
    throw new Error("Email already in use");
  }

  const existingUsername = await authRepository.findByUsername(data.username);
  if (existingUsername) {
    throw new Error("Username already taken");
  }

  const processed = await runHook("beforeUserRegister", { ...data });
  const hookResult = processed as { email: string; username: string; password: string } | null;
  const finalData = hookResult || data;

  const passwordHash = await hashPassword(finalData.password);

  const user = await authRepository.create({
    username: finalData.username,
    email: finalData.email,
    passwordHash,
  });

  await createSession({ userId: user.id, email: user.email, role: user.role });

  const result = { id: user.id, username: user.username, email: user.email };
  await runHook("afterUserRegister", result);

  return result;
}

export async function login(input: LoginInput) {
  const data = loginSchema.parse(input);

  const user = await authRepository.findByEmailOrUsername(data.email);
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const valid = await verifyPassword(data.password, user.passwordHash);
  if (!valid) {
    throw new Error("Invalid email or password");
  }

  await createSession({ userId: user.id, email: user.email, role: user.role });

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
  };
}
