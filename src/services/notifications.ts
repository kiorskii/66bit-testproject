import { apiGet } from "./api";

export interface Deadline {
  id: number;
  text: string;
  due: string; // YYYY-MM-DD
}

export const fetchNotifications = () =>
  apiGet<{ deadlines: Deadline[]; recommendations: string[] }>(
    `/notifications`
  );
