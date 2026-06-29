import { NextRequest } from "next/server";
import { getSession } from "@/lib/jwt";
import { getNotifications } from "@/services/notificationService";
import { errorResponse, AuthenticationError } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) throw new AuthenticationError();

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.min(
      50,
      Math.max(1, parseInt(searchParams.get("pageSize") || "20", 10)),
    );

    const result = await getNotifications(session.userId, page, pageSize);
    return Response.json(result);
  } catch (error) {
    return errorResponse(error);
  }
}
