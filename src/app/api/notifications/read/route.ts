import { getSession } from "@/lib/jwt";
import { markAsRead, markAllAsRead } from "@/services/notificationService";
import { errorResponse, AuthenticationError } from "@/lib/errors";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) throw new AuthenticationError();

    const body = await request.json().catch(() => ({}));
    const { id } = body;

    if (id) {
      await markAsRead(id, session.userId);
    } else {
      await markAllAsRead(session.userId);
    }

    return Response.json({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
