import { getSession } from "@/lib/jwt";
import {
  getAnalyticsOverview,
  getViewsChart,
} from "@/services/analyticsService";
import { errorResponse, AuthenticationError } from "@/lib/errors";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") throw new AuthenticationError();

    const [overview, viewsChart, trafficSources] = await Promise.all([
      getAnalyticsOverview(),
      getViewsChart(7),
      (await import("@/services/trafficService")).getTrafficOverview(5),
    ]);

    return Response.json({ overview, viewsChart, trafficSources });
  } catch (error) {
    return errorResponse(error);
  }
}
