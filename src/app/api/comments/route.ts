import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { createComment } from "@/services/comment.service";

export async function POST(request: Request) {
  const session = await verifySession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const comment = await createComment(body, session.userId);
    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create comment";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
