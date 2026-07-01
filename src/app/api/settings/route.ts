import { getSession } from "@/lib/jwt";
import { AuthenticationError, AuthorizationError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";

const DEFAULT_SETTINGS = {
  siteName: "maddyBlog",
  siteDescription: "A modern blogging platform",
  postsPerPage: "10",
  language: "en",
};

export async function GET() {
  const session = await getSession();
  if (!session) throw new AuthenticationError();
  if (session.role !== "ADMIN") throw new AuthorizationError();

  const rows = await prisma.setting.findMany();
  const settings = { ...DEFAULT_SETTINGS };
  for (const row of rows) {
    settings[row.key as keyof typeof settings] = row.value;
  }
  return Response.json(settings);
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) throw new AuthenticationError();
  if (session.role !== "ADMIN") throw new AuthorizationError();

  const body = await request.json();
  const allowed = Object.keys(
    DEFAULT_SETTINGS,
  ) as (keyof typeof DEFAULT_SETTINGS)[];

  await Promise.all(
    allowed.map((key) => {
      const value = body[key];
      if (value === undefined) return Promise.resolve();
      return prisma.setting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      });
    }),
  );

  return Response.json({ success: true });
}
