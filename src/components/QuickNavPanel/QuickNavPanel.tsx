// src/components/QuickNavPanel.tsx
import { Card, Row, Col } from "antd";
import {
  TeamOutlined,
  FolderOpenOutlined,
  BarChartOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const tile: React.CSSProperties = {
  height: 100,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 8,
  background: "#fafafa",
  cursor: "pointer",
  transition: "background 0.2s",
};

export default function QuickNavPanel() {
  const iconStyle: React.CSSProperties = { fontSize: 24, color: "#1890ff" };
  const labelStyle: React.CSSProperties = { marginTop: 8, fontSize: 14 };

  return (
    <Card title="Быстрая навигация" style={{ marginBottom: 24 }}>
      <Row gutter={[16, 16]}>
        <Col xs={8} sm={6} md={6}>
          <Link to="/employees">
            <div style={tile}>
              <TeamOutlined style={iconStyle} />
              <span style={labelStyle}>Сотрудники</span>
            </div>
          </Link>
        </Col>
        <Col xs={8} sm={6} md={6}>
          <Link to="/projects">
            <div style={tile}>
              <FolderOpenOutlined style={iconStyle} />
              <span style={labelStyle}>Проекты</span>
            </div>
          </Link>
        </Col>
        <Col xs={8} sm={6} md={6}>
          <Link to="/analytics">
            <div style={tile}>
              <BarChartOutlined style={iconStyle} />
              <span style={labelStyle}>Аналитика</span>
            </div>
          </Link>
        </Col>
        <Col xs={8} sm={6} md={6}>
          <Link to="/settings">
            <div style={tile}>
              <SettingOutlined style={iconStyle} />
              <span style={labelStyle}>Настройки</span>
            </div>
          </Link>
        </Col>
      </Row>
    </Card>
  );
}
