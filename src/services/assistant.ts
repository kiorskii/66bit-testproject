import { apiPost } from "./api";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  ts: number;
}

export async function askAssistant(text: string, attachment?: any) {
  const body: any = { message: text };
  if (attachment) body.attachment = attachment;

  const res = await apiPost<{ reply: string; ts: number }>("/assistant", body);
  return { role: "assistant", content: res.reply, ts: res.ts };
}
