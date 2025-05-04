// src/components/AIWidgetPanel.tsx
import { Card, Button, Typography } from "antd";
import { RobotOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Paragraph } = Typography;

export default function AIWidgetPanel() {
  const navigate = useNavigate();
  return (
    <Card title="AI-Ассистент" style={{ textAlign: "center" }}>
      <Paragraph>
        Нужна помощь? Наш AI-ассистент готов ответить на ваши вопросы и дать
        рекомендации по работе с проектами и сотрудниками.
      </Paragraph>
      <Button
        type="primary"
        icon={<RobotOutlined />}
        onClick={() => navigate("/assistant")}
        style={{ marginTop: 16 }}
      >
        Задать вопрос помощнику
      </Button>
    </Card>
  );
}
