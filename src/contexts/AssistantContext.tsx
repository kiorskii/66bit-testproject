/*  src/contexts/AssistantContext.tsx  */
import { createContext, useState, ReactNode, useRef } from "react";
import { askAssistant } from "../services/assistant";

/* тип одного сообщения */
export interface ChatMsg {
  role: "user" | "assistant";
  content: string;
  ts: number;
  att?: any;
}

interface Ctx {
  history: ChatMsg[];
  send: (text: string, att?: any) => Promise<void>;
}
export const AssistantContext = createContext<Ctx>({
  history: [],
  send: async () => {},
});

export function AssistantProvider({ children }: { children: ReactNode }) {
  const [history, setHist] = useState<ChatMsg[]>([]);
  const timers = useRef<Record<number, NodeJS.Timeout>>({}); // таймеры по id

  async function send(text: string, att?: any) {
    /* ---------- 1. добавляем пользовательское сообщение ---------- */
    if (att) {
      setHist((h) => [
        ...h,
        { role: "user", content: "", att, ts: Date.now() },
      ]);
    }
    if (text) {
      setHist((h) => [...h, { role: "user", content: text, ts: Date.now() }]);
    }

    /* ---------- 2. placeholder ассистента ---------- */
    const placeholderId = Date.now() + 1;
    setHist((h) => [
      ...h,
      { role: "assistant", content: "", ts: placeholderId },
    ]);

    /* ---------- 3. получаем полный ответ ---------- */
    const { content: full } = await askAssistant(text, att); // возвращаем {content, ts}
    let idx = 0;

    /* ---------- 4. «пишем» по 2 символа каждые 30 мс ---------- */
    timers.current[placeholderId] = setInterval(() => {
      idx += 2;
      setHist((h) =>
        h.map((m) =>
          m.ts === placeholderId ? { ...m, content: full.slice(0, idx) } : m
        )
      );
      if (idx >= full.length) {
        clearInterval(timers.current[placeholderId]);
        delete timers.current[placeholderId];
      }
    }, 30);
  }

  return (
    <AssistantContext.Provider value={{ history, send }}>
      {children}
    </AssistantContext.Provider>
  );
}
