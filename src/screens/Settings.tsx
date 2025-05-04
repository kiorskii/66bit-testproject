// src/screens/Settings.tsx
import { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Space,
  Typography,
  Popconfirm,
} from "antd";
import { PlusOutlined, CheckOutlined, DeleteOutlined } from "@ant-design/icons";
import Header from "../components/Header/Header";
import Navigation from "../components/Navigation/Navigation";
import Footer from "../components/Footer/Footer";
import { createUser, deleteUser, fetchUsers, User } from "../services/user";
import {
  addCompetency,
  addPosition,
  deleteCompetency,
  deletePosition,
  fetchCompetencies,
  fetchPositions,
} from "../services/reference";
import {
  fetchIntegrationTokens,
  saveIntegrationToken,
  deleteIntegrationToken,
} from "../services/integration";

const { Title } = Typography;

export default function Settings() {
  // Users
  const [users, setUsers] = useState<User[]>([]);
  const [userModal, setUserModal] = useState(false);
  const [userForm] = Form.useForm();

  // Integrations
  const [tokens, setTokens] = useState<Record<string, string>>({});
  const [intModal, setIntModal] = useState<"jira" | "1c" | "bitrix" | null>(
    null
  );
  const [intForm] = Form.useForm();

  // Reference
  const [positions, setPositions] = useState<string[]>([]);
  const [competencies, setCompetencies] = useState<string[]>([]);
  const [refForm] = Form.useForm();
  const [refType, setRefType] = useState<"position" | "competency">("position");

  useEffect(() => {
    async function load() {
      try {
        setUsers(await fetchUsers());
        setPositions(await fetchPositions());
        setCompetencies(await fetchCompetencies());
        setTokens(await fetchIntegrationTokens());
      } catch {
        message.error("Ошибка загрузки настроек");
      }
    }
    load();
  }, []);

  // Удаление справочника
  const handleDeleteRef = async (name: string) => {
    try {
      if (refType === "position") {
        await deletePosition(name);
        message.success("Должность удалена");
        setPositions(await fetchPositions());
      } else {
        await deleteCompetency(name);
        message.success("Компетенция удалена");
        setCompetencies(await fetchCompetencies());
      }
    } catch {
      message.error("Ошибка при удалении");
    }
  };

  // Users handlers
  const handleAddUser = async (values: any) => {
    await createUser(values);
    message.success("Пользователь создан");
    setUserModal(false);
    setUsers(await fetchUsers());
  };

  // Reference handler
  const handleAddRef = async (values: any) => {
    if (refType === "position") await addPosition(values.name);
    else await addCompetency(values.name);
    message.success("Добавлено");
    setPositions(await fetchPositions());
    setCompetencies(await fetchCompetencies());
    refForm.resetFields();
  };

  // Integration handlers
  const handleSaveToken = async (values: any) => {
    if (!intModal) return;
    await saveIntegrationToken(intModal, values.token);
    message.success("Токен сохранен");
    setIntModal(null);
    setTokens(await fetchIntegrationTokens());
  };

  const handleDeleteIntegration = async (svc: string) => {
    await deleteIntegrationToken(svc);
    message.success(`${svc.toUpperCase()} отключен`);
    setTokens(await fetchIntegrationTokens());
  };

  // ниже handleAddUser
  const handleDeleteUser = async (id: number) => {
    await deleteUser(id);
    message.success("Пользователь удалён");
    setUsers(await fetchUsers());
  };

  return (
    <>
      <Header />
      <Navigation />
      <div
        style={{ maxWidth: 1300, margin: "24px auto", paddingBottom: "100px" }}
      >
        <Title level={2}>Настройки системы</Title>
        <Row gutter={24}>
          {/* Управление пользователями */}
          <Col xs={24} lg={12}>
            <Card
              title="Управление пользователями"
              style={{ marginBottom: 24 }}
              extra={
                <Button
                  icon={<PlusOutlined />}
                  onClick={() => setUserModal(true)}
                >
                  Добавить
                </Button>
              }
            >
              <Table
                rowKey="id"
                dataSource={users}
                pagination={false}
                columns={[
                  { title: "Email", dataIndex: "email" },
                  { title: "Роль", dataIndex: "role" },
                  {
                    title: "Действия",
                    key: "actions",
                    render: (_: any, r: User) => (
                      <Popconfirm
                        title="Удалить пользователя?"
                        onConfirm={() => handleDeleteUser(r.id)}
                      >
                        <Button icon={<DeleteOutlined />} danger size="small" />
                      </Popconfirm>
                    ),
                  },
                ]}
              />
            </Card>
          </Col>

          {/* Интеграции */}
          <Col xs={24} lg={12}>
            <Card title="Интеграции" style={{ marginBottom: 24 }}>
              <Space direction="vertical" style={{ width: "100%" }}>
                {(["jira", "1c", "bitrix"] as const).map((svc) => {
                  const connected = Boolean(tokens[svc]);
                  return (
                    <Space key={svc} style={{ width: "100%" }}>
                      <Button
                        block
                        type={connected ? "primary" : "default"}
                        icon={connected ? <CheckOutlined /> : <PlusOutlined />}
                        onClick={() => setIntModal(svc)}
                      >
                        {connected
                          ? `${svc.toUpperCase()} подключён`
                          : `Подключить ${svc.toUpperCase()}`}
                      </Button>
                      {connected && (
                        <Popconfirm
                          title="Отключить интеграцию?"
                          onConfirm={() => handleDeleteIntegration(svc)}
                        >
                          <Button icon={<DeleteOutlined />} danger />
                        </Popconfirm>
                      )}
                    </Space>
                  );
                })}
              </Space>
            </Card>
          </Col>

          {/* Справочники на всю ширину */}
          <Col xs={24} lg={24}>
            <Card title="Справочники">
              <Space style={{ marginBottom: 16 }}>
                <Button
                  type={refType === "position" ? "primary" : "default"}
                  onClick={() => setRefType("position")}
                >
                  Должности
                </Button>
                <Button
                  type={refType === "competency" ? "primary" : "default"}
                  onClick={() => setRefType("competency")}
                >
                  Компетенции
                </Button>
              </Space>
              <Form form={refForm} layout="inline" onFinish={handleAddRef}>
                <Form.Item
                  name="name"
                  rules={[{ required: true, message: "Введите значение" }]}
                >
                  <Input placeholder="Новая запись" />
                </Form.Item>
                <Form.Item>
                  <Button htmlType="submit" icon={<PlusOutlined />}>
                    Добавить
                  </Button>
                </Form.Item>
              </Form>
              <Table
                rowKey={(r: any) => r}
                dataSource={refType === "position" ? positions : competencies}
                pagination={false}
                style={{ marginTop: 16 }}
                columns={[
                  {
                    title: refType === "position" ? "Должность" : "Компетенция",
                    render: (text: string) => text,
                  },
                  {
                    title: "Действия",
                    key: "actions",
                    width: 80,
                    render: (_text, record) => (
                      <Popconfirm
                        title={`Удалить ${record}?`}
                        onConfirm={() => handleDeleteRef(record)}
                      >
                        <Button icon={<DeleteOutlined />} danger />
                      </Popconfirm>
                    ),
                  },
                ]}
              />
            </Card>
          </Col>
        </Row>
      </div>

      {/* Modals */}
      <Modal
        title="Новый пользователь"
        open={userModal}
        onCancel={() => setUserModal(false)}
        onOk={() => userForm.submit()}
      >
        <Form form={userForm} layout="vertical" onFinish={handleAddUser}>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Введите email" },
              { type: "email", message: "Неверный формат" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Пароль"
            rules={[{ required: true }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item name="role" label="Роль" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="PM">PM</Select.Option>
              <Select.Option value="Lead">Timelid</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={intModal && `Интеграция ${intModal.toUpperCase()}`}
        open={!!intModal}
        onCancel={() => setIntModal(null)}
        onOk={() => intForm.submit()}
      >
        <Form form={intForm} layout="vertical" onFinish={handleSaveToken}>
          <Form.Item
            name="token"
            label="API Token"
            rules={[{ required: true }]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>

      <Footer />
    </>
  );
}
