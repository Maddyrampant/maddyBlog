import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

type UserPublic = {
  id: string;
  email: string;
  username: string;
  role: "USER" | "ADMIN";
};

export async function findByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function findByUsername(username: string) {
  return prisma.user.findUnique({ where: { username } });
}

export async function findByEmailOrUsername(identifier: string) {
  return prisma.user.findFirst({
    where: {
      OR: [{ email: identifier }, { username: identifier }],
    },
  });
}

export async function create(data: Prisma.UserCreateInput) {
  return prisma.user.create({ data });
}

export async function findById(id: string): Promise<UserPublic | null> {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, username: true, role: true },
  });
  return user;
}
