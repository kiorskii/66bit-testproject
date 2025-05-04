import { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Spin,
  Carousel,
  List,
  Typography,
  Tag,
  Space,
} from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import { fetchNotifications, Deadline } from "../../services/notifications";
import dayjs from "dayjs";

const { Text, Title } = Typography;

export default function RecommendationsPanel() {
  const [loading, setLoading] = useState(true);
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [recs, setRecs] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { deadlines, recommendations } = await fetchNotifications();
        setDeadlines(deadlines.sort((a, b) => dayjs(a.due).diff(dayjs(b.due))));
        setRecs(recommendations);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <Card title="Рекомендации и ближайшие дедлайны">
        <Spin style={{ display: "block", margin: "24px auto" }} />
      </Card>
    );
  }

  return (
    <Card
      title="Рекомендации и ближайшие дедлайны"
      style={{ marginBottom: 24 }}
    >
      <Row gutter={24} align="top">
        {/* Рекомендации */}
        <Col xs={24} md={12}>
          <Title level={5}>Рекомендации</Title>
          <Carousel
            autoplay
            autoplaySpeed={5000}
            dots
            style={{ padding: "16px 0" }}
          >
            {recs.map((r, i) => (
              <div
                key={i}
                style={{
                  textAlign: "center",
                  minHeight: 100,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 16, lineHeight: "1.5" }}>{r}</Text>
              </div>
            ))}
          </Carousel>
        </Col>

        {/* Дедлайны */}
        <Col xs={24} md={12}>
          <Title level={5}>Ближайшие дедлайны</Title>
          <List
            dataSource={deadlines}
            renderItem={(d: Deadline) => {
              const daysLeft = dayjs(d.due).diff(dayjs(), "day");
              let color = "green";
              if (daysLeft <= 2) color = "red";
              else if (daysLeft <= 5) color = "orange";

              return (
                <List.Item key={d.id}>
                  <List.Item.Meta
                    avatar={
                      <ClockCircleOutlined style={{ fontSize: 24, color }} />
                    }
                    title={
                      <Space>
                        <Text>{d.text}</Text>
                        <Tag color={color}>{daysLeft} дн.</Tag>
                      </Space>
                    }
                    description={
                      <Text type="secondary">
                        Срок: {dayjs(d.due).format("DD.MM.YYYY")}
                      </Text>
                    }
                  />
                </List.Item>
              );
            }}
          />
        </Col>
      </Row>
    </Card>
  );
}
