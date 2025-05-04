import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import {
  Card,
  Col,
  Row,
  Tag,
  Spin,
  Typography,
  List,
  Button,
  message,
} from "antd";
import dayjs from "dayjs";
import { useContext } from "react";
import { AssistantContext } from "../contexts/AssistantContext";

import Header from "../components/Header/Header";
import Navigation from "../components/Navigation/Navigation";
import Footer from "../components/Footer/Footer";

import { fetchProject, fetchAnalysis } from "../services/project";
import { Project } from "../types";
import LoadCell from "../components/LoadCell";
import { RobotOutlined } from "@ant-design/icons";
import styles from "./ProjectCard.module.css";

import { Table, Avatar } from "antd";
import LoadBar from "../components/LoadBar";

import { Input } from "antd";
import { askProjectAssistant } from "../services/project";
import { Drawer, Tooltip, Popconfirm } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { fetchEmployees } from "../services/api";
import { updateProjectTeam } from "../services/project";
import ChatMessage from "../components/ChatMessage/ChatMessage";

const { Title, Paragraph } = Typography;

export default function ProjectCard() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [proj, setProj] = useState<Project | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [analLoading, setAnalLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [empList, setEmpList] = useState([]);
  const [empLoading, setEmpLoading] = useState(false);
  const { send: sendAI } = useContext(AssistantContext);

  /* загрузка сотрудников когда открываем Drawer */
  const openDrawer = async () => {
    setDrawerOpen(true);
    if (empList.length) return;
    setEmpLoading(true);
    setEmpList(await fetchEmployees(1, 100));
    setEmpLoading(false);
  };

  /* сохранить новый состав */
  const saveTeam = async (newTeam: Employee[]) => {
    const updated = await updateProjectTeam(id!, newTeam);
    setProj(updated); // обновляем локальный state
  };

  const [chat, setChat] = useState<
    { role: "user" | "assistant"; content: string; ts: number }[]
  >([]);
  const [msg, setMsg] = useState("");
  const [sending, setSending] = useState(false);

  const sendMsg = async () => {
    const txt = msg.trim();
    if (!txt) return;

    /* 1. сообщение пользователя */
    setChat((c) => [...c, { role: "user", content: txt, ts: Date.now() }]);
    setMsg("");
    setSending(true);

    /* 2. placeholder ассистента */
    const id = Date.now() + 1;
    setChat((c) => [...c, { role: "assistant", content: "", ts: id }]);

    /* 3. получаем полный ответ */
    try {
      const { reply } = await askProjectAssistant(id!, txt);

      /* 4. печатаем по 2 символа каждые 30 мс */
      let idx = 0;
      const timer = setInterval(() => {
        idx += 2;
        setChat((c) =>
          c.map((m) =>
            m.ts === id ? { ...m, content: reply.slice(0, idx) } : m
          )
        );
        if (idx >= reply.length) clearInterval(timer);
      }, 30);
    } finally {
      setSending(false);
    }
  };

  /* ─── загрузка проекта ─── */
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchProject(id!);
        setProj(data);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  /* ─── запрос анализа ─── */
  const loadAnalysis = async () => {
    setAnalLoading(true);
    try {
      const res = await fetchAnalysis(id!);
      setAnalysis(res);
    } catch {
      message.error("AI-анализ временно недоступен");
    } finally {
      setAnalLoading(false);
    }
  };

  if (loading)
    return (
      <Spin size="large" style={{ display: "block", margin: "120px auto" }} />
    );

  if (!proj) return <p style={{ textAlign: "center" }}>Проект не найден</p>;

  /* ----- колонки команды ----- */
  const teamCols = [
    { title: "Имя", dataIndex: "name", key: "name" },
    { title: "Роль", dataIndex: "role", key: "role" },
    {
      title: "Загрузка",
      dataIndex: "capacity",
      key: "cap",
      render: (v: number) => <LoadCell v={v ?? 0} />,
    },
  ];

  return (
    <>
      <Header />
      <Navigation />

      <div
        style={{
          maxWidth: 1300,
          margin: "24px auto",
          height: "100%",
          width: "100%",
        }}
      >
        <Title level={2} style={{ marginBottom: 0 }}>
          {proj.name}{" "}
          <Tag
            color={
              proj.priority === "High"
                ? "red"
                : proj.priority === "Med"
                ? "gold"
                : "green"
            }
          >
            {proj.priority}
          </Tag>
        </Title>
        <Paragraph type="secondary" style={{ marginTop: 4 }}>
          {dayjs(proj.start).format("DD.MM.YYYY")} –{" "}
          {dayjs(proj.end).format("DD.MM.YYYY")}
        </Paragraph>

        <Row gutter={[24, 24]}>
          {/* ----- Описание + метрики + риски ----- */}
          <Col xs={24} md={10}>
            <Card title="Описание" style={{ marginBottom: 24 }}>
              {proj.description || <i>Нет описания</i>}
            </Card>

            <Card
              title="Ключевые метрики"
              className={analysis ? styles.fadeIn1 : undefined}
              extra={
                <Button
                  className={analysis ? "" : styles.aiBtn}
                  icon={<RobotOutlined />}
                  loading={analLoading}
                  onClick={loadAnalysis}
                  style={{
                    /* оранжевая палитра Ant Design (#fa8c16) */
                    borderColor: "#fa8c16",
                  }}
                >
                  {analysis ? "Обновить анализ" : "AI-анализ"}
                </Button>
              }
              style={{ marginBottom: 24 }}
            >
              {analysis ? (
                <>
                  <p>
                    Длительность: <b>{analysis.metrics.durationDays} дней</b>
                  </p>
                  <p>
                    Средняя загрузка: <b>{analysis.metrics.avgLoad}%</b>
                  </p>
                  <p>
                    Индекс риска: <b>{analysis.metrics.riskScore}</b>
                  </p>
                </>
              ) : (
                <p style={{ color: "#888" }}>
                  Нажмите «Рассчитать», чтобы получить метрики.
                </p>
              )}
            </Card>
            {analysis && (
              <Card
                className={styles.fadeIn2}
                title="AI-описание проекта"
                style={{ marginBottom: 24 }}
              >
                <Paragraph style={{ marginBottom: 0 }}>
                  {analysis.description}
                </Paragraph>
              </Card>
            )}

            <Card
              className={analysis ? styles.fadeIn3 : undefined}
              title="Риски и рекомендации"
            >
              {analysis ? (
                <>
                  <List
                    size="small"
                    header="Обнаруженные риски"
                    dataSource={analysis.risks}
                    renderItem={(r: string) => <List.Item>⚠️ {r}</List.Item>}
                  />
                  <List
                    size="small"
                    header="Рекомендации"
                    dataSource={analysis.recommendations}
                    renderItem={(r: string) => <List.Item>💡 {r}</List.Item>}
                    style={{ marginTop: 16 }}
                  />
                </>
              ) : (
                <p style={{ color: "#888" }}>
                  Риски будут показаны после AI-анализа.
                </p>
              )}
            </Card>
          </Col>

          {/* ----- Команда ----- */}
          <Col xs={24} md={14}>
            <Card
              title={`Состав команды (${proj.team.length})`}
              extra={
                <Tooltip title="Добавить исполнителя">
                  <Button
                    shape="circle"
                    icon={<PlusOutlined />}
                    onClick={openDrawer}
                  />
                </Tooltip>
              }
            >
              {" "}
              <Table
                rowKey="id"
                dataSource={proj.team}
                pagination={false}
                size="small"
                scroll={{ y: 340 }}
                /* ➊ — кликабельная строка */
                onRow={(rec) => ({
                  style: { cursor: "pointer" },
                  onClick: () => navigate(`/employee/${rec.id}`),
                })}
                columns={[
                  {
                    title: "",
                    dataIndex: "photo",
                    width: 48,
                    render: (src: string) => <Avatar src={src} />,
                  },
                  {
                    title: "Имя",
                    dataIndex: "name",
                    render: (_: any, r) => (
                      <Link
                        onClick={(e) => e.stopPropagation()}
                        to={`/employee/${r.id}`}
                      >
                        {r.name}
                      </Link>
                    ),
                  },
                  {
                    title: "Роль",
                    dataIndex: "role",
                    render: (v, r) => v || r.position,
                  },
                  {
                    title: "Загрузка",
                    dataIndex: "capacity",
                    render: (v: number = 0) => <LoadBar v={v} />,
                    width: 90,
                  },
                  {
                    title: "",
                    width: 40,
                    render: (_: any, r) => (
                      <Popconfirm
                        title="Убрать из команды?"
                        onConfirm={(e?: React.MouseEvent) => {
                          e?.stopPropagation(); // ← 1) гасим у Popconfirm
                          saveTeam(proj.team.filter((m) => m.id !== r.id));
                        }}
                        onCancel={(e?: React.MouseEvent) =>
                          e?.stopPropagation()
                        }
                      >
                        <DeleteOutlined
                          style={{ cursor: "pointer" }}
                          className={styles.delBtn}
                          onClick={(e) => e.stopPropagation()} // ← 2) гасим у самой иконки
                        />
                      </Popconfirm>
                    ),
                  },
                ]}
              />
            </Card>
            <Card
              title="Вопрос ассистенту"
              className={styles.fadeIn}
              style={{ marginTop: 24 }}
            >
              <div
                style={{
                  maxHeight: 220,
                  overflowY: "auto",
                  marginBottom: 12,
                  paddingRight: 4,
                }}
              >
                {chat.map((m) => (
                  <ChatMessage key={m.ts} m={m} />
                ))}
              </div>

              <Input.Search
                placeholder="Введите сообщение"
                enterButton="Отправить"
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                onSearch={sendMsg}
                loading={sending}
              />
            </Card>
          </Col>
        </Row>
      </div>
      <Drawer
        title="Добавить участника"
        placement="right"
        width={420}
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
      >
        <Table
          rowKey="id"
          loading={empLoading}
          dataSource={empList}
          size="small"
          pagination={false}
          columns={[
            { title: "Имя", dataIndex: "name" },
            { title: "Позиция", dataIndex: "position" },
            {
              title: "",
              width: 40,
              render: (_: any, e: Employee) => (
                <Button
                  type="text"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    if (proj.team.some((m) => m.id === e.id)) return;
                    saveTeam([...proj.team, { ...e, role: e.position }]);
                  }}
                />
              ),
            },
          ]}
        />
      </Drawer>

      <Footer />
    </>
  );
}
