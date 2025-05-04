import { Link } from "react-router-dom";
import { Card, Row, Col } from "antd";
import {
  FolderOpenOutlined,
  PlusOutlined,
  RobotOutlined,
  SettingOutlined,
  TeamOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import ChatWidget from "../ChatWidget/ChatWidget";
import InfoPanel from "../InfoPanel/InfoPanel";
import AnalyticsPanel from "../AnalyticsPanel/AnalyticsPanel";
import RecommendationsPanel from "../RecommendationsPanel/RecommendationsPanel";
import QuickNavPanel from "../QuickNavPanel/QuickNavPanel";
import AIWidgetPanel from "../AIWidgetPanel/AIWidgetPanel";

const tile: React.CSSProperties = {
  height: 176, // квадрат ~ как на скрине
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 12,
};

const iconStyle: React.CSSProperties = {
  fontSize: 42, // тонкая большая иконка
  color: "#9b9b9b",
};

const labelStyle: React.CSSProperties = {
  marginTop: 20,
  fontWeight: 600, // жирный
  fontSize: 17,
};

export default function Welcome() {
  return (
    <>
      <h1 style={{ textAlign: "center", margin: "32px 0 40px", fontSize: 40 }}>
        Добро пожаловать в сервис Team Craft!
      </h1>
      {/* ─── Информационная панель ─────────────────── */}
      <Row justify="center">
        <Col xs={24} md={22}>
          <InfoPanel />
        </Col>
      </Row>
      {/* ─── Панель рекомендаций & дедлайны ───────── */}
      <Row justify="center">
        <Col xs={24} md={22}>
          <RecommendationsPanel />
        </Col>
      </Row>
      {/* ─── Панель аналитики ───────────────────────── */}
      <Row justify="center">
        <Col xs={24} md={22}>
          <AnalyticsPanel />
        </Col>
      </Row>
      {/* ─── дополнительные маленькие панели ───────────────── */}{" "}
      <Row gutter={[24, 22]} justify="center">
        {" "}
        <Col xs={24} md={11}>
          {" "}
          <AIWidgetPanel />{" "}
        </Col>{" "}
        <Col xs={24} md={11}>
          <QuickNavPanel />{" "}
        </Col>{" "}
      </Row>
      <Row gutter={[24, 22]} justify="center" style={{ marginTop: 24 }}>
        {/* ─── две верхние плитки ───────────────────────── */}
        <Col xs={24} md={11}>
          <Link to="/add-employee">
            <Card hoverable bodyStyle={tile}>
              <PlusOutlined style={iconStyle} />
              <span style={labelStyle}>Добавить&nbsp;сотрудника</span>
            </Card>
          </Link>
        </Col>

        <Col xs={24} md={11}>
          <Link to="/import-employees">
            <Card hoverable bodyStyle={tile}>
              <UploadOutlined style={iconStyle} />
              <span style={labelStyle}>Добавить&nbsp;из&nbsp;файла</span>
            </Card>
          </Link>
        </Col>
      </Row>
      <Row gutter={[24, 22]} justify="center" style={{ marginTop: 24 }}>
        {/* ─── нижняя широкая плитка ─────────────────────── */}
        <Col xs={24} md={22}>
          <Link to="/employees">
            <Card
              hoverable
              bodyStyle={{ ...tile, height: 148 /* чуть ниже */ }}
            >
              <TeamOutlined style={iconStyle} />
              <span style={labelStyle}>
                Смотреть&nbsp;всех&nbsp;сотрудников
              </span>
              <span>120 сотрудников</span>
            </Card>
          </Link>
        </Col>
      </Row>
      <Row gutter={[24, 22]} justify="center" style={{ marginTop: 24 }}>
        <Col xs={24} md={7}>
          <Link to="/create-project">
            <Card hoverable bodyStyle={tile}>
              <PlusOutlined style={iconStyle} />
              <span style={labelStyle}>Создать&nbsp;проект</span>
            </Card>
          </Link>
        </Col>
        <Col xs={24} md={7}>
          <Link to="/projects">
            <Card hoverable bodyStyle={tile}>
              <FolderOpenOutlined style={iconStyle} />{" "}
              {/* Иконка для "Все проекты" */}
              <span style={labelStyle}>Все проекты</span>
            </Card>
          </Link>
        </Col>
        <Col xs={24} md={7}>
          <Link to="/settings">
            <Card hoverable bodyStyle={tile}>
              <SettingOutlined style={iconStyle} />{" "}
              <span style={labelStyle}>Настройки</span>
            </Card>
          </Link>
        </Col>
        <ChatWidget />
      </Row>
    </>
  );
}
