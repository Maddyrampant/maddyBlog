import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { getSession } from "@/lib/jwt";
import { errorResponse, AuthenticationError } from "@/lib/errors";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/avif",
];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) throw new AuthenticationError();

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return Response.json(
        { error: "No file provided", code: "VALIDATION_ERROR" },
        { status: 400 },
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return Response.json(
        {
          error: "Invalid file type. Allowed: JPEG, PNG, GIF, WebP, AVIF",
          code: "VALIDATION_ERROR",
        },
        { status: 400 },
      );
    }

    if (file.size > MAX_SIZE) {
      return Response.json(
        {
          error: "File too large. Maximum size: 5MB",
          code: "VALIDATION_ERROR",
        },
        { status: 400 },
      );
    }

    const ext = file.name.split(".").pop() || "png";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    await mkdir(uploadDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadDir, filename), buffer);

    const url = `/uploads/${filename}`;

    return Response.json({ url }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
