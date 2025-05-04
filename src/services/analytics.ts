import { apiGet, apiPost } from "./api";

export interface AnaPointW {
  week: string;
  avgLoad: number;
  velocity: number;
  risk: number;
  stack: Record<string, number>;
  absences: number;
  cost: number;
  budget: number;
}
export interface AnaPointM extends Omit<AnaPointW, "week"> {
  month: string;
}

export const fetchAnalytics = (period: "weekly" | "monthly") =>
  apiGet<{ period: string; data: any[] }>(`/analytics?period=${period}`);

export const fetchAnalyticsRange = (from: string, to: string) =>
  apiGet<{ period: string; data: any[] }>(
    `/analytics?period=custom&start=${from}&end=${to}`
  );

export const askAnalyticsSummary = (payload: {
  period: string;
  start?: string;
  end?: string;
}) => apiPost<{ reply: string; ts: number }>("/analytics/summary", payload);
