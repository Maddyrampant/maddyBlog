import { getSession } from "@/lib/jwt";
import type { PluginContext, PluginCoreServices } from "./types";

function createPluginLogger() {
  return {
    info: (msg: string, meta?: Record<string, unknown>) => {
      console.log(`[plugin] INFO: ${msg}`, meta ?? "");
    },
    warn: (msg: string, meta?: Record<string, unknown>) => {
      console.warn(`[plugin] WARN: ${msg}`, meta ?? "");
    },
    error: (msg: string, meta?: Record<string, unknown>) => {
      console.error(`[plugin] ERROR: ${msg}`, meta ?? "");
    },
  };
}

function createPluginConfig() {
  const defaults = {
    NEXT_PUBLIC_APP_URL:
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    LOG_LEVEL: process.env.LOG_LEVEL || "info",
  };

  return {
    get: (key: string): string | undefined => {
      const safeKeys = ["NEXT_PUBLIC_APP_URL", "LOG_LEVEL"] as const;
      if (safeKeys.includes(key as (typeof safeKeys)[number])) {
        return process.env[key] || defaults[key as keyof typeof defaults];
      }
      return defaults.NEXT_PUBLIC_APP_URL;
    },
    getAll: (): Record<string, string> => {
      return { ...defaults };
    },
  };
}

function createPluginAuth() {
  return {
    getCurrentUserId: async (): Promise<string | null> => {
      try {
        const session = await getSession();
        return session?.userId ?? null;
      } catch {
        return null;
      }
    },
    hasRole: async (role: string): Promise<boolean> => {
      try {
        const session = await getSession();
        return session?.role === role;
      } catch {
        return false;
      }
    },
    isAuthenticated: async (): Promise<boolean> => {
      try {
        const session = await getSession();
        return !!session;
      } catch {
        return false;
      }
    },
  };
}

function createPluginDb() {
  const prismaPromise = import("@/lib/prisma").then((m) => m.prisma);

  return {
    post: {
      findMany: async (args?: Record<string, unknown>) => {
        const prisma = await prismaPromise;
        return prisma.post.findMany({
          where: { status: "PUBLISHED" },
          select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: 10,
          ...(args || {}),
        });
      },
      findUnique: async (args: Record<string, unknown>) => {
        const prisma = await prismaPromise;
        return prisma.post.findUnique({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          where: args.where as any,
          select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            content: true,
            createdAt: true,
          },
        });
      },
      count: async (args?: Record<string, unknown>) => {
        const prisma = await prismaPromise;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return prisma.post.count(args as any);
      },
    },
    comment: {
      findMany: async (args?: Record<string, unknown>) => {
        const prisma = await prismaPromise;
        return prisma.comment.findMany({
          select: {
            id: true,
            content: true,
            createdAt: true,
            author: { select: { username: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 20,
          ...(args || {}),
        });
      },
      count: async (args?: Record<string, unknown>) => {
        const prisma = await prismaPromise;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return prisma.comment.count(args as any);
      },
    },
    category: {
      findMany: async (args?: Record<string, unknown>) => {
        const prisma = await prismaPromise;
        return prisma.category.findMany({
          orderBy: { name: "asc" },
          ...(args || {}),
        });
      },
    },
    tag: {
      findMany: async (args?: Record<string, unknown>) => {
        const prisma = await prismaPromise;
        return prisma.tag.findMany({
          orderBy: { name: "asc" },
          ...(args || {}),
        });
      },
    },
  };
}

export async function buildPluginContext(): Promise<PluginContext> {
  let userId: string | undefined;
  let userRole: string | undefined;

  try {
    const session = await getSession();
    if (session) {
      userId = session.userId;
      userRole = session.role;
    }
  } catch {
    // not authenticated — context still valid with undefined user
  }

  const services: PluginCoreServices = {
    logger: createPluginLogger(),
    config: createPluginConfig(),
    auth: createPluginAuth(),
    db: createPluginDb(),
  };

  return {
    userId,
    userRole,
    requestId:
      crypto.randomUUID?.() ??
      `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    services,
  };
}
