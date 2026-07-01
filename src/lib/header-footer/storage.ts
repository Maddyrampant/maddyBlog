import type { HeaderConfig, FooterConfig } from "./types";
import { themePresets } from "./defaultConfigs";

let prismaClient: unknown = null;

async function getPrisma() {
  if (typeof window !== "undefined") return null;
  if (prismaClient) return prismaClient;
  try {
    const mod = await import("@/lib/prisma");
    prismaClient = mod.prisma;
    return prismaClient;
  } catch {
    return null;
  }
}

export async function getHeaderFooterConfig(
  themeName: string,
): Promise<{ header: HeaderConfig; footer: FooterConfig } | null> {
  const prisma = await getPrisma();
  if (!prisma) return null;
  try {
    const record = await (
      prisma as unknown as {
        headerFooter: {
          findUnique: (opts: {
            where: { themeName: string };
          }) => Promise<{ header: string; footer: string } | null>;
        };
      }
    ).headerFooter.findUnique({
      where: { themeName },
    });
    if (record) {
      return {
        header: JSON.parse(record.header) as HeaderConfig,
        footer: JSON.parse(record.footer) as FooterConfig,
      };
    }
    return null;
  } catch {
    return null;
  }
}

export async function saveHeaderFooterConfig(
  themeName: string,
  header: HeaderConfig,
  footer: FooterConfig,
): Promise<boolean> {
  const prisma = await getPrisma();
  if (!prisma) return false;
  try {
    await (
      prisma as unknown as {
        headerFooter: {
          upsert: (opts: {
            where: { themeName: string };
            update: { header: string; footer: string };
            create: { themeName: string; header: string; footer: string };
          }) => Promise<unknown>;
        };
      }
    ).headerFooter.upsert({
      where: { themeName },
      update: {
        header: JSON.stringify(header),
        footer: JSON.stringify(footer),
      },
      create: {
        themeName,
        header: JSON.stringify(header),
        footer: JSON.stringify(footer),
      },
    });
    return true;
  } catch {
    return false;
  }
}

export function getDefaultConfig(themeName: string): {
  header: HeaderConfig;
  footer: FooterConfig;
} {
  const preset = themePresets[themeName] ?? themePresets.default!;
  return {
    header: JSON.parse(JSON.stringify(preset.header)),
    footer: JSON.parse(JSON.stringify(preset.footer)),
  };
}

export async function loadConfig(
  themeName: string,
): Promise<{ header: HeaderConfig; footer: FooterConfig }> {
  const saved = await getHeaderFooterConfig(themeName);
  if (saved) return saved;
  return getDefaultConfig(themeName);
}
