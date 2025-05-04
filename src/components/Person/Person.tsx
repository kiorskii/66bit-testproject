import { useContext, useEffect, useRef, useState } from "react";
import styles from "./Person.module.css";
import { useNavigate } from "react-router-dom";
import EditEmployeeModal from "../EditEmployeeModal/EditEmployeeModal";
import { Button, Card, Col, message, Row, Space, Table, Tag } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Tabs, Progress, Drawer, Modal, Input, Tooltip } from "antd";
import {
  RobotOutlined,
  PlusOutlined,
  CommentOutlined,
} from "@ant-design/icons";
import ReactECharts from "echarts-for-react";
import { askAssistant } from "../services/assistant"; // печать уже есть
import { AssistantContext } from "../../contexts/AssistantContext";
import LoadBar from "../LoadBar";
import { saveNote } from "../../services/employee";
import {
  fetchEmployeeProjects,
  fetchProjects,
  updateProjectTeam,
} from "../../services/project";
import { askEmployeeSummary } from "../../services/employee"; // новый сервис
import dayjs from "dayjs";

const Person = ({ employee }) => {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false); // Состояние для отображения модального окна
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [noteOpen, setNoteOpen] = useState(false);
  const [note, setNote] = useState(employee?.notes ?? "");
  const [saving, setSaving] = useState(false);
  const { send } = useContext(AssistantContext); // для AI-анализа
  const [projDrawerOpen, setProjDrawerOpen] = useState(false);
  const [projList, setProjList] = useState<Project[]>([]);
  const [projLoading, setProjLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [typed, setTyped] = useState("");
  const typingRef = useRef();
  const [empProjects, setEmpProjects] = useState([]);

  const getSummary = async () => {
    if (typing) return;
    setTyped("");
    setTyping(true);

    await new Promise((r) => setTimeout(r, 400)); // «думает…»

    const { reply } = await askEmployeeSummary(employee.id);

    let idx = 0;
    typingRef.current = setInterval(() => {
      idx += 2;
      setTyped(reply.slice(0, idx));
      if (idx >= reply.length) {
        clearInterval(typingRef.current!);
        setTyping(false);
      }
    }, 40);
  };
  useEffect(() => () => clearInterval(typingRef.current!), []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    // не запускаем, пока нет employee или не на вкладке «Проекты»
    if (activeTab !== "projects" || !employee) return;

    setProjLoading(true);
    fetchEmployeeProjects(employee.id)
      .then(setEmpProjects)
      .catch(() => message.error("Не удалось загрузить проекты"))
      .finally(() => setProjLoading(false));
  }, [activeTab, employee]);

  const MainInfo = [
    { label: "Контактный телефон:", value: employee?.phone },
    { label: "День рождения:", value: employee?.birthdate },
    { label: "Дата устройства:", value: employee?.dateOfEmployment },
  ];

  const openProjDrawer = async () => {
    setProjDrawerOpen(true);
    if (projList.length) return;
    setProjLoading(true);
    try {
      const list = await fetchProjects(); // сервис уже есть
      setProjList(list);
    } finally {
      setProjLoading(false);
    }
  };

  // Функция для удаления сотрудника
  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:3001/api/Employee/${employee?.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      navigate("/employees");

      if (!response.ok) {
        throw new Error("Failed to delete employee");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error: ", error);
      throw error;
    }
  };

  useEffect(() => {
    setNote(employee?.notes ?? "");
  }, [employee?.notes]);

  return (
    <div className={styles.person}>
      <div className={styles.top}>
        <div className={styles.person__imgContainer}>
          <img
            className={styles.person__image}
            src={employee?.photo}
            alt="avatar"
          />
        </div>
        <div>
          <h2 className={styles.person__name}>{employee?.name}</h2>
          <p className={styles.person__position}>{employee?.position}</p>
          <div className={styles.person__stack}>
            {employee?.stack.map((item, index) => (
              <p key={index} className={styles.person__stackItem}>
                {item}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.person__mainInfo + " " + styles.top2}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h3 className={styles.person__title}>Основная информация</h3>
          <Space size="middle" style={{ marginBottom: 24 }}>
            <Button
              icon={<EditOutlined />}
              onClick={openModal}
              type="default"
              size="middle"
            >
              Редактировать
            </Button>
            <Button
              danger
              icon={<DeleteOutlined />}
              size="middle"
              onClick={() => setShowConfirm(true)}
            >
              Удалить
            </Button>
            <Tooltip title="Добавить в проект">
              <Button
                icon={<PlusOutlined />}
                shape="circle"
                onClick={openProjDrawer}
              />
            </Tooltip>

            <Tooltip title="Добавить комментарий">
              <Button
                icon={<CommentOutlined />}
                shape="circle"
                onClick={() => setNoteOpen(true)}
              />
            </Tooltip>
          </Space>
        </div>

        <ul className={styles.person__infoList}>
          {MainInfo.map((item, index) => (
            <li key={index} className={styles.person__infoItem}>
              <p className={styles.person__infoLabel}>{item.label}</p>
              <p className={styles.person__infoValue}>{item.value}</p>
            </li>
          ))}
        </ul>
      </div>
      <Row style={{ marginTop: 24, marginBottom: 24 }}>
        <Col xs={24}>
          <Card
            title="AI-сводка специалиста"
            extra={
              <Button
                icon={<RobotOutlined />}
                loading={typing}
                style={{
                  background: "#fa8c16",
                  borderColor: "#fa8c16",
                  color: "#fff",
                }}
                onClick={getSummary}
              >
                Сформировать
              </Button>
            }
          >
            {typed ? (
              <p style={{ whiteSpace: "pre-wrap", marginBottom: 16 }}>
                {typed}
              </p>
            ) : (
              <p style={{ color: "#888", marginBottom: 16 }}>
                Нажмите «Сформировать», чтобы получить краткий анализ
                сотрудника.
              </p>
            )}
            <Button
              type="link"
              style={{ padding: 0 }}
              onClick={() => {
                const att = {
                  type: "employee",
                  id: employee.id,
                  name: employee.name,
                  position: employee.position,
                  photo: employee.photo,
                };
                navigate("/assistant", { state: { attachment: att } });
              }}
            >
              Узнать больше по специалисту у ассистента
            </Button>
          </Card>
        </Col>
      </Row>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: "general",
            label: "Общая информация",
            children: (
              <>
                {/* старая верстка "Основная информация" */}
                <h4>Ключевые компетенции</h4>
                <div className={styles.person__stack}>
                  {(employee?.stack ?? []).map((s, i) => (
                    <p key={i} className={styles.person__stackItem}>
                      {s}
                    </p>
                  ))}
                </div>
                {employee?.experience && ( // ← добавили ?
                  <p style={{ marginTop: 8, color: "#555" }}>
                    Опыт: {employee.experience}
                  </p>
                )}

                <h4 style={{ marginTop: 16 }}>Текущая загруженность</h4>
                <LoadBar v={employee?.capacity ?? 0} />
              </>
            ),
          },
          {
            key: "projects",
            label: "Проекты",
            children: (
              <Table<EmpProject>
                rowKey="id"
                loading={projLoading}
                dataSource={empProjects}
                size="small"
                pagination={false}
                columns={[
                  { title: "Проект", dataIndex: "name" },
                  {
                    title: "Приоритет",
                    dataIndex: "priority",
                    render: (p) => (
                      <Tag
                        color={
                          p === "High" ? "red" : p === "Med" ? "gold" : "green"
                        }
                      >
                        {p}
                      </Tag>
                    ),
                  },
                  { title: "Роль", dataIndex: "role" },
                  {
                    title: "Сроки",
                    render: (_: any, r: EmpProject) =>
                      `${dayjs(r.start).format("DD.MM.YY")}–${dayjs(
                        r.end
                      ).format("DD.MM.YY")}`,
                  },
                  {
                    title: "",
                    width: 36,
                    render: (_: any, r: EmpProject) => (
                      <Button
                        type="link"
                        onClick={() => navigate(`/projects/${r.id}`)}
                      >
                        Открыть
                      </Button>
                    ),
                  },
                ]}
              />
            ),
          },
          {
            key: "eff",
            label: "Эффективность",
            children: (
              <ReactECharts
                option={{
                  title: {
                    text: "KPI за 12 недель",
                    left: "center",
                    textStyle: { fontSize: 14 },
                  },
                  xAxis: {
                    type: "category",
                    data: [...Array(12).keys()].map((i) => "W" + (i + 1)),
                  },
                  yAxis: { type: "value", max: 100 },
                  series: [
                    {
                      type: "line",
                      data: [...Array(12)].map(() => 60 + Math.random() * 30),
                      smooth: true,
                    },
                  ],
                }}
              />
            ),
          },
        ]}
      />

      <Modal
        open={noteOpen}
        title="Комментарий руководителя"
        onCancel={() => setNoteOpen(false)}
        onOk={async () => {
          setSaving(true);
          try {
            await saveNote(employee.id, note);
            message.success("Комментарий сохранён");
            // локально обновляем, чтобы сразу отобразилось
            if (employee) employee.notes = note;
            setNoteOpen(false);
          } catch {
            message.error("Не удалось сохранить");
          } finally {
            setSaving(false);
          }
        }}
        confirmLoading={saving}
      >
        <Input.TextArea
          rows={4}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </Modal>

      <EditEmployeeModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        employee={employee}
        refreshData={() => {}} // Здесь можно передать функцию обновления данных
      />

      {/* Модальное окно подтверждения */}
      {showConfirm && (
        <div className={styles.confirmModal}>
          <div className={styles.confirmModalContent}>
            <h3>Вы уверены, что хотите удалить этого сотрудника?</h3>
            <button onClick={handleDelete}>Да</button>
            <button onClick={() => setShowConfirm(false)}>Отмена</button>
          </div>
        </div>
      )}
      <Drawer
        title="Добавить в проект"
        placement="right"
        width={420}
        open={projDrawerOpen}
        onClose={() => setProjDrawerOpen(false)}
      >
        <Table
          rowKey="id"
          loading={projLoading}
          dataSource={projList}
          size="small"
          pagination={false}
          columns={[
            { title: "Проект", dataIndex: "name" },
            { title: "Приоритет", dataIndex: "priority" },
            {
              title: "",
              width: 40,
              render: (_: any, p: Project) => (
                <Button
                  type="text"
                  icon={<PlusOutlined />}
                  onClick={async () => {
                    // проверяем, не состоит ли уже
                    if (p.team.some((m) => m.id === employee.id)) {
                      message.info("Сотрудник уже в этом проекте");
                      return;
                    }
                    const newTeam = [
                      ...p.team,
                      { ...employee, role: employee.position },
                    ];
                    await updateProjectTeam(p.id, newTeam);
                    message.success(`Добавлен в «${p.name}»`);
                  }}
                />
              ),
            },
          ]}
        />
      </Drawer>
    </div>
  );
};

export default Person;
