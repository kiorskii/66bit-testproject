import { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, Typography, Spin } from "antd";
import dayjs from "dayjs";
import { fetchEmployees } from "../../services/api";
import { fetchProjects } from "../../services/project";

const { Text } = Typography;

export default function InfoPanel() {
  const [loading, setLoading] = useState(true);
  const [empCount, setEmpCount] = useState(0);
  const [avgLoad, setAvgLoad] = useState(0);
  const [projCount, setProjCount] = useState(0);
  const notificationsCount = 3; // моковое

  const [updated, setUpdated] = useState<string>("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        // получаем сотрудников и проекты параллельно
        const [emps, projs] = await Promise.all([
          fetchEmployees(1, 1000),
          fetchProjects(),
        ]);
        setEmpCount(emps.length);
        const totalLoad = emps.reduce((sum, e) => sum + (e.capacity ?? 0), 0);
        setAvgLoad(emps.length ? Math.round(totalLoad / emps.length) : 0);
        setProjCount(projs.length);
        setUpdated(dayjs().format("DD.MM.YYYY HH:mm"));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <Card style={{ marginBottom: 24 }}>
        <Spin style={{ display: "block", margin: "24px auto" }} />
      </Card>
    );
  }

  return (
    <Card title="Общая информация" style={{ marginBottom: 24 }}>
      <Row gutter={[16, 16]} justify="space-around">
        <Col xs={12} sm={6}>
          <Statistic title="Сотрудников" value={empCount} />
        </Col>
        <Col xs={12} sm={6}>
          <Statistic title="Средняя загрузка" value={`${avgLoad}%`} />
        </Col>
        <Col xs={12} sm={6}>
          <Statistic title="Проектов" value={projCount} />
        </Col>
        <Col xs={12} sm={6}>
          <Statistic title="Уведомления" value={notificationsCount} />
        </Col>
      </Row>
      <div style={{ textAlign: "right", marginTop: 12 }}>
        <Text type="secondary">Обновлено: {updated}</Text>
      </div>
    </Card>
  );
}
