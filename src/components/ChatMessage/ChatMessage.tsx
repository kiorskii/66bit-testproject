import { CSSProperties } from "react";

export interface Msg {
  role: "user" | "assistant";
  content: string;
  ts: number;
  att?: any;
}

const bubble: CSSProperties = {
  maxWidth: 320,
  whiteSpace: "pre-wrap",
  padding: "6px 10px",
  borderRadius: 8,
  fontSize: 14,
};

export default function ChatMessage({ m }: { m: Msg }) {
  const mine = m.role === "user";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: mine ? "flex-end" : "flex-start",
        padding: "4px 0",
      }}
    >
      <div
        style={{
          ...bubble,
          background: mine ? "#fa8c16" : "#f5f5f5",
          color: mine ? "#fff" : "#000",
        }}
      >
        {/* ----- вложение аналитики ----- */}
        {m.att && m.att.type === "analytics" && (
          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: 6,
              padding: 6,
              marginBottom: 6,
              background: "#fff",
              color: "#000",
            }}
          >
            📊 <b>Аналитика</b>
            <br />
            {m.att.period === "custom"
              ? `${m.att.start} — ${m.att.end}`
              : m.att.period === "weekly"
              ? "Недельная"
              : "Месячная"}
          </div>
        )}
        {m.att && m.att.type === "employee" && (
          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: 6,
              padding: 6,
              marginBottom: 6,
              background: "#fff",
              color: "#000",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <img
              src={m.att.photo}
              alt=""
              style={{ width: 32, height: 32, borderRadius: "50%" }}
            />
            <div>
              📇 <b>{m.att.name}</b>
              <br />
              {m.att.position}
            </div>
          </div>
        )}

        {/* ----- основной текст ----- */}
        {m.content}
      </div>
    </div>
  );
}
