// src/screens/ChatPage.tsx
import { useContext, useRef, useEffect, useState } from "react";
import { Button, Input } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { AssistantContext } from "../contexts/AssistantContext";
import ChatMessage from "../components/ChatMessage/ChatMessage";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { useLocation } from "react-router-dom";

export default function ChatPage() {
  const { history, send } = useContext(AssistantContext);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [text, setText] = useState("");
  const nav = useNavigate();
  const { state } = useLocation() as { state?: { attachment?: any } };

  useEffect(() => {
    if (state?.attachment) {
      // отправляем "сообщение" с вложением ровно один раз
      send("", state.attachment); // send из контекста
    }
  }, [state]);

  useEffect(() => {
    wrapRef.current?.scrollTo(0, wrapRef.current.scrollHeight);
  }, [history]);

  const onSend = () => {
    if (!text.trim()) return;
    send(text.trim());
    setText("");
  };

  return (
    <>
      <Header />
      <div
        style={{
          maxWidth: 1300,
          margin: "24px auto",
          height: "100vh",
          width: "100%",
        }}
      >
        <div
          style={{
            height: "100%",
          }}
        >
          <div
            style={{
              padding: "10px 16px",
              borderBottom: "1px solid #eee",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <Button
              type="text"
              icon={<LeftOutlined />}
              onClick={() => nav(-1)}
            />
            <h2 style={{ margin: 0 }}>AI-ассистент</h2>
          </div>

          {/* messages */}
          <div
            ref={wrapRef}
            style={{
              flex: 1,
              overflowY: "auto",
              padding: 16,
              height: "calc(100% - 64px)",
            }}
          >
            {history.map((m) => (
              <ChatMessage key={m.ts} m={m} />
            ))}
          </div>

          {/* input */}
          <div style={{ borderTop: "1px solid #eee", padding: 12 }}>
            <Input.Search
              placeholder="Введите сообщение"
              enterButton="Отправить"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onSearch={onSend}
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
