import { getTrafficSources } from "./analyticsService";

export async function getTrafficOverview(limit = 5) {
  return getTrafficSources(limit);
}

export type TrafficSource = {
  source: string;
  count: number;
};
