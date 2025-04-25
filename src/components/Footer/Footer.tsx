// Footer.tsx
import { Layout, Row, Col, Typography, Space } from 'antd';
import { Link } from 'react-router-dom';
import {
  GithubOutlined,
  MailOutlined,
  LinkedinOutlined,
} from '@ant-design/icons';

const { Footer: AntFooter } = Layout;
const { Title } = Typography;


const sections = {
  Навигация: [
    { label: 'Главная', to: '/' },
    { label: 'Все сотрудники', to: '/employees' },
    { label: 'Добавить сотрудника', to: '/add-employee' },
    { label: 'Импорт из файла', to: '/import-employees' },
  ],
  Документация: [
    { label: 'Руководство пользователя', href: '/docs/user-guide.pdf' },
    { label: 'REST API', href: '/docs/api' },
    { label: 'FAQ', href: '/faq' },
  ],
  Поддержка: [
    { label: 'Telegram-чат', href: 'https://t.me/your_hr_chat' },
    { label: 'Отправить отзыв', href: 'mailto:hr@company.ru' },
    { label: 'Сообщить об ошибке', href: 'https://github.com/company/hr-system/issues' },
  ],
};

const social = [
  { icon: <GithubOutlined />, href: 'https://github.com/company/hr-system' },
  { icon: <LinkedinOutlined />, href: 'https://www.linkedin.com/company/yourcompany' },
  { icon: <MailOutlined />, href: 'mailto:hr@company.ru' },
];


export default function Footer() {
  return (
    <AntFooter style={{ background: '#000', padding: '64px 5vw', marginTop: 48 }}>
      <Row justify="center" gutter={[0, 32]}>
        {/* Логотип + соц-сети */}
        <Col xs={24} md={6}>
          <Title level={2} style={{ color: '#fff', margin: 0 }}>
            HR&nbsp;Manager
          </Title>

          <Space size="large" style={{ marginTop: 24 }}>
            {social.map(({ icon, href }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#fff', fontSize: 20 }}
              >
                {icon}
              </a>
            ))}
          </Space>
        </Col>

        {/* Динамические колонки ссылок */}
        {Object.entries(sections).map(([header, items]) => (
          <Col xs={24} md={6} key={header}>
            <Title level={5} style={{ color: '#fff' }}>
              {header}
            </Title>

            <Space direction="vertical" size={8}>
              {items.map(({ label, to, href }) =>
                to ? (
                  <Link
                    key={label}
                    to={to}
                    style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14 }}
                  >
                    {label}
                  </Link>
                ) : (
                  <a
                    key={label}
                    href={href}
                    target={href?.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14 }}
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
