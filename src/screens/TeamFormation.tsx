// src/screens/TeamFormation.tsx
import { useState } from "react";
import {
  Card,
  Form,
  Input,
  Select,
  DatePicker,
  Row,
  Col,
  Tabs,
  Table,
  Tag,
  Button,
  message,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import { useEffect } from "react";
import { fetchEmployees } from "../services/api";

import { ProjectForm } from "../types";
import { recommendTeam, createProject } from "../services/project";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import Navigation from "../components/Navigation/Navigation";
import LoadCell from "../components/LoadCell";

const { RangePicker } = DatePicker;

/* ------------------------------------------------------------------ */

export default function TeamFormation() {
  const [form] = Form.useForm<ProjectForm & { range: [Dayjs, Dayjs] }>();

  const [recommended, setRecommended] = useState<Employee[]>([]);
  const [loadingRec, setLoadingRec] = useState(false);
  const [team, setTeam] = useState<Employee[]>([]);

  const [manual, setManual] = useState<Employee[]>([]);
  const [manLoading, setManLoading] = useState(false);
  const [manPage, setManPage] = useState({ current: 1, pageSize: 8, total: 0 });

  /* ─── загрузка таблицы ручного подбора ─── */
  const loadManual = async (page = 1) => {
    setManLoading(true);
    try {
      const data = await fetchEmployees(page, manPage.pageSize);
      setManual(data);
      setManPage((p) => ({ ...p, current: page, total: 200 })); // total можно жёстко 200 для примера
    } finally {
      setManLoading(false);
    }
  };
  useEffect(() => {
    loadManual();
  }, []);

  const navigate = useNavigate();

  /* ───── helpers ───────────────────────── */
  const addMember = (e: Employee) =>
    setTeam((t) => (t.some((m) => m.id === e.id) ? t : [...t, e]));

  const removeMember = (id: number) =>
    setTeam((t) => t.filter((m) => m.id !== id));

  /* ───── финальное создание проекта ────── */
  const onFinish = async (values: any) => {
    if (!team.length) {
      message.warning("Добавьте участников");
      return;
    }
    const [start, end] = values.range; // Dayjs[]
    const payload = {
      ...values,
      start: start.format("YYYY-MM-DD"),
      end: end.format("YYYY-MM-DD"),
      team: team.map((t) => ({ ...t, role: t.position })),
    };
    delete payload.range;

    try {
      const proj = await createProject(payload as any);
      message.success("Проект создан");
      navigate(`/projects/${proj.id}`);
    } catch {
      message.error("Ошибка при создании проекта");
    }
  };

  /* ───── колонки таблиц ────────────────── */
  const loadCol = {
    title: "Загрузка",
    dataIndex: "capacity",
    render: (v: number) => <LoadCell v={v} />,
  };

  const empCols = [
    { title: "Имя", dataIndex: "name" },
    { title: "Позиция", dataIndex: "position" },
    loadCol,
    {
      title: "Стек",
      render: (_: any, r: Employee) =>
        r.stack?.map((s) => <Tag key={s}>{s}</Tag>),
    },
    {
      title: "",
      width: 40,
      render: (_: any, r: Employee) => (
        <Button
          type="text"
          icon={<PlusOutlined />}
          onClick={() => addMember(r)}
        />
      ),
    },
  ];

  const teamCols = [
    { title: "Имя", dataIndex: "name" },
    { title: "Роль", dataIndex: "position" },
    loadCol,
    {
      title: "",
      width: 40,
      render: (_: any, r: Employee) => (
        <Button
          type="text"
          icon={<DeleteOutlined />}
          onClick={() => removeMember(r.id)}
        />
      ),
    },
  ];

  /* ---------- состояние вариантов ---------- */
  type Variant = { label: string; desc: string; members: Employee[] };
  const [variants, setVariants] = useState<Variant[]>([]);

  const onRecommend = async () => {
    const skills: string[] = form.getFieldValue("skills") || [];
    setLoadingRec(true);
    try {
      // три запроса подряд (можно Promise.all)
      const [opt, hard, analytic] = await Promise.all([
        recommendTeam({ skills, size: 5 }),
        recommendTeam({ skills, size: 6 }),
        recommendTeam({ skills, size: 4 }),
      ]);
      setVariants([
        {
          label: "Оптимальный выбор",
          desc: "Команда, сбалансированная по навыкам и уровню загрузки. Подходит для выполнения задач в стандартные сроки с минимальными рисками. Участники имеют равномерное распределение нагрузки.",
          members: opt.members.map(mockCap),
        },
        {
          label: "💪 Фокус на разработку (трудозатраты +30%)",
          desc: "Команда с усиленным блоком разработки, включающая больше сеньор-разработчиков. Это минимизирует риски по срокам, но увеличивает трудозатраты. Подходит для сложных технических проектов.",
          members: hard.members.map(mockCap),
        },
        {
          label: "🔍 Сильная аналитика",
          desc: "Команда с акцентом на аналитические роли, включая BA и DA. Подходит для проектов с высокой сложностью предметной области. Обеспечивает глубокий анализ и минимизацию ошибок на этапе планирования.",
          members: analytic.members.map(mockCap),
        },
      ]);
    } catch {
      message.error("Не удалось получить рекомендацию");
    } finally {
      setLoadingRec(false);
    }
  };

  /* если у кого-то нет capacity */
  const mockCap = (e: Employee) => ({
    ...e,
    capacity: e.capacity ?? Math.floor(Math.random() * 100),
  });

  /* ------------------------------------------------------------------ */

  return (
    <>
      <Header />
      <Navigation />
      <div
        style={{
          maxWidth: 1300,
          margin: "24px auto",
          height: "10000px",
          width: "100%",
        }}
      >
        <Row gutter={24}>
          {/* ────────── Левая колонка ────────── */}
          <Col xs={24} md={14}>
            {/* форма проекта */}
            <Card title="Данные проекта" style={{ marginBottom: 24 }}>
              <Form
                form={form}
                layout="vertical"
                initialValues={{ priority: "Med" }}
                onFinish={onFinish}
              >
                <Form.Item
                  name="name"
                  label="Название"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item name="description" label="Описание">
                  <Input.TextArea autoSize={{ minRows: 2 }} />
                </Form.Item>

                <Form.Item name="skills" label="Требуемые компетенции">
                  <Select mode="tags" placeholder="React, Java…" />
                </Form.Item>

                <Form.Item
                  name="range"
                  label="Сроки"
                  rules={[{ required: true, message: "Укажите даты" }]}
                >
                  <RangePicker />
                </Form.Item>

                <Form.Item name="priority" label="Приоритет">
                  <Select>
                    <Select.Option value="Low">Низкий 🔥</Select.Option>
                    <Select.Option value="Med">Средний 🔥🔥</Select.Option>
                    <Select.Option value="High">Высокий 🔥🔥🔥</Select.Option>
                  </Select>
                </Form.Item>
              </Form>
            </Card>

            {/* вкладки */}
            <Card>
              <Tabs defaultActiveKey="manual" style={{ marginTop: 0 }}>
                {/* ---- manual ---- */}
                <Tabs.TabPane tab="Ручной подбор" key="manual">
                  <Table
                    rowKey="id"
                    loading={manLoading}
                    dataSource={manual}
                    columns={empCols}
                    size="small"
                    pagination={{
                      ...manPage,
                      onChange: (p) => loadManual(p),
                    }}
                    scroll={{ y: 260 }}
                    style={{ marginTop: 12 }}
                  />
                </Tabs.TabPane>

                {/* ---- recommended ---- */}
                <Tabs.TabPane tab="Рекомендуемый состав" key="recommend">
                  <Button
                    type="primary"
                    onClick={onRecommend}
                    loading={loadingRec}
                  >
                    Запросить рекомендацию
                  </Button>

                  {variants.length > 0 && (
                    <div
                      style={{
                        marginTop: 16,
                        display: "flex",
                        flexDirection: "column",
                        gap: 24,
                      }}
                    >
                      {variants.map((v) => (
                        <Card
                          key={v.label}
                          hoverable
                          onClick={() => v.members.forEach(addMember)}
                          bodyStyle={{ padding: 12 }}
                        >
                          <h3
                            style={{ margin: "6px 0 12px", fontSize: "24px" }}
                          >
                            {v.label}
                          </h3>
                          <Table
                            rowKey="id"
                            dataSource={v.members}
                            columns={[...empCols.slice(0, 3)]}
                            size="small"
                            pagination={false}
                          />
                          <p
                            style={{
                              marginTop: 8,
                              fontSize: 14,
                              color: "#555",
                            }}
                          >
                            {v.desc}
                          </p>
                        </Card>
                      ))}
                    </div>
                  )}
                </Tabs.TabPane>
              </Tabs>
            </Card>
          </Col>

          {/* ────────── Правая колонка ───────── */}
          <Col xs={24} md={10}>
            <Card
              title={`Команда проекта (${team.length})`}
              style={{ height: "100%" }}
            >
              <Table
                rowKey="id"
                dataSource={team}
                columns={teamCols}
                size="small"
                pagination={false}
              />

              <div style={{ marginTop: 24, textAlign: "right" }}>
                <Button
                  onClick={() => navigate(-1)}
                  style={{ marginRight: 12 }}
                >
                  Отмена
                </Button>
                <Button type="primary" onClick={() => form.submit()}>
                  Сформировать команду
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      <Footer />
    </>
  );
}
