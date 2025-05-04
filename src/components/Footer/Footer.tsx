// Footer.tsx
import { Layout, Row, Col, Typography, Space } from "antd";
import { Link } from "react-router-dom";
import {
  GithubOutlined,
  MailOutlined,
  LinkedinOutlined,
} from "@ant-design/icons";
import styles from "./Footer.module.css";

const { Footer: AntFooter } = Layout;
const { Title } = Typography;

const sections = {
  Навигация: [
    { label: "Главная", to: "/" },
    { label: "Все сотрудники", to: "/employees" },
    { label: "Добавить сотрудника", to: "/add-employee" },
    { label: "Импорт из файла", to: "/import-employees" },
  ],
  Документация: [
    { label: "Руководство пользователя", href: "/docs/user-guide.pdf" },
    { label: "REST API", href: "/docs/api" },
    { label: "FAQ", href: "/faq" },
  ],
  Поддержка: [
    { label: "Telegram-чат", href: "https://t.me/your_hr_chat" },
    { label: "Отправить отзыв", href: "mailto:hr@company.ru" },
    {
      label: "Сообщить об ошибке",
      href: "https://github.com/company/hr-system/issues",
    },
  ],
};

export default function Footer() {
  return (
    <AntFooter
      style={{ background: "#000", padding: "64px 5vw", marginTop: 48 }}
    >
      <Row justify="center" gutter={[0, 32]}>
        {/* Логотип + соц-сети */}
        <Col xs={24} md={6}>
          <Link to={"/"} className={styles.footer__logo}>
            <img
              className={styles.footer__img}
              src="/src/assets/logo_ver.png"
              alt="logo"
            />
          </Link>
        </Col>

        {/* Динамические колонки ссылок */}
        {Object.entries(sections).map(([header, items]) => (
          <Col xs={24} md={6} key={header}>
            <Title level={5} style={{ color: "#fff" }}>
              {header}
            </Title>

            <Space direction="vertical" size={8}>
              {items.map(({ label, to, href }) =>
                to ? (
                  <Link
                    key={label}
                    to={to}
                    style={{ color: "rgba(255,255,255,0.65)", fontSize: 14 }}
                  >
                    {label}
                  </Link>
                ) : (
                  <a
                    key={label}
                    href={href}
                    target={href?.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    style={{ color: "rgba(255,255,255,0.65)", fontSize: 14 }}
                  >
                    {label}
                  </a>
                )
              )}
            </Space>
          </Col>
        ))}
      </Row>
    </AntFooter>
  );
}
