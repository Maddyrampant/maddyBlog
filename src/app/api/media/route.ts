import { NextResponse } from "next/server";
import { readdir, stat } from "node:fs/promises";
import { unlink } from "node:fs/promises";
import path from "node:path";
import { getSession } from "@/lib/jwt";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const files = await readdir(UPLOAD_DIR);
    const items = await Promise.all(
      files.map(async (name) => {
        const filePath = path.join(UPLOAD_DIR, name);
        const stats = await stat(filePath);
        const ext = name.split(".").pop()?.toLowerCase() || "";
        const isImage = ["jpg", "jpeg", "png", "gif", "webp", "avif", "svg"].includes(ext);
        return {
          name,
          url: `/uploads/${name}`,
          size: stats.size,
          type: isImage ? `image/${ext}` : "application/octet-stream",
          uploadedAt: stats.birthtime.toISOString(),
        };
      }),
    );

    items.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
    return NextResponse.json(items);
  } catch {
    return NextResponse.json([]);
  }
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { url } = await request.json();
    const filename = url.replace("/uploads/", "");
    const filePath = path.join(UPLOAD_DIR, filename);
    await unlink(filePath);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 400 });
  }
}
