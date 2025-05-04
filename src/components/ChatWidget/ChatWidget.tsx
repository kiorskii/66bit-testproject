import { useContext, useState, useRef, useEffect } from 'react';
import { Button, Input } from 'antd';
import { MessageOutlined, CloseOutlined, ExpandOutlined } from '@ant-design/icons';
import { AssistantContext } from '../../contexts/AssistantContext';
import ChatMessage from '../ChatMessage/ChatMessage';
import { useNavigate } from 'react-router-dom';
import styles from './ChatWidget.module.css';          // ← подключили модули

export default function ChatWidget() {
  const { history, send } = useContext(AssistantContext);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [showTip, setShowTip] = useState(false);       // «Нужна помощь?»
  const wrapRef = useRef<HTMLDivElement>(null);
  const nav = useNavigate();

  /* автоскролл вниз */
  useEffect(() => {
    wrapRef.current?.scrollTo(0, wrapRef.current.scrollHeight);
  }, [history, open]);

  /* каждые 40 с показываем подсказку, если чат закрыт */
  useEffect(() => {
    const id = setInterval(() => {
      if (!open) {
        setShowTip(true);
        setTimeout(() => setShowTip(false), 10400);      // fadeOut запускается на 4 с
      }
    }, 5_000);
    return () => clearInterval(id);
  }, [open]);

  const onSend = () => {
    if (!text.trim()) return;
    send(text.trim());
    setText('');
  };

  return (
    <>
      {/* ───── плавающая кнопка с пульсацией ───── */}
      <Button
        type="primary" shape="circle" 
        icon={<MessageOutlined />}
        className={`${styles.pulseBtn} ${styles.pulseBtnXL}`}
        onClick={() => setOpen(o => !o)}
      />

      {/* всплывающая подсказка */}
      {showTip && !open && (
        <div className={styles.helpTip}>Нужна&nbsp;помощь?</div>
      )}

      {/* ───── окно чата ───── */}
      {open && (
        <div style={{
          position:'fixed', right:24, bottom:90, width:340, height:420,
          background:'#fff', border:'1px solid #ddd', borderRadius:12,
          display:'flex', flexDirection:'column', zIndex:1000,
          boxShadow:'0 4px 18px rgba(0,0,0,.12)'
        }}>
          {/* header */}
          <div style={{
            padding:'8px 12px', borderBottom:'1px solid #eee',
            display:'flex', justifyContent:'space-between', alignItems:'center'
          }}>
            <b>AI-ассистент</b>
            <span>
              <Button icon={<ExpandOutlined />} size="small" type="text"
                      onClick={() => nav('/assistant')} />
              <Button icon={<CloseOutlined />} size="small" type="text"
                      onClick={() => setOpen(false)} />
            </span>
          </div>

          {/* messages */}
          <div ref={wrapRef} style={{ flex:1, overflowY:'auto', padding:12 }}>
            {history.map(m => <ChatMessage key={m.ts} m={m} />)}
          </div>

          {/* input */}
          <div style={{ borderTop:'1px solid #eee', padding:8 }}>
            <Input.Search
              placeholder="Введите сообщение"
              enterButton="Отправить"
              value={text}
              onChange={e => setText(e.target.value)}
              onSearch={onSend}
            />
          </div>
        </div>
      )}
    </>
  );
}
