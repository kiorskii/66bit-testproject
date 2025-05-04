import { apiGet, apiPut } from "./api";

export const saveNote = (id: number | string, note: string) =>
  apiPut(`/Employee/${id}`, { notes: note });

export const askEmployeeSummary = (id: number | string) =>
  apiGet<{ reply: string }>(`/Employee/${id}/analysis`);
