import { useEffect, useState } from "react";
import { Card, Spin, Row, Col, Button } from "antd";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { fetchAnalytics } from "../../services/analytics";
import loadable from "@loadable/component";

const ReactECharts = loadable(() => import("echarts-for-react"));

export default function AnalyticsPanel() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetchAnalytics("weekly");
        setData(res.data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <Card title="Аналитика (недельная)">
        <Spin style={{ display: "block", margin: "24px auto" }} />
      </Card>
    );
  }

  const X = data.map((d) => d.week);
  const loadSeries = data.map((d) => d.avgLoad);
  const velSeries = data.map((d) => d.velocity);

  return (
    <Card
      title="Аналитика (недельная)"
      extra={
        <Link to="/analytics">
          <Button type="link">Перейти к аналитике →</Button>
        </Link>
      }
      style={{ marginBottom: 24 }}
    >
      <Row gutter={24}>
        <Col xs={24} md={12}>
          <ReactECharts
            style={{ height: 200 }}
            option={{
              title: {
                text: "Средняя загрузка, %",
                left: "center",
                textStyle: { fontSize: 14 },
              },
              tooltip: { trigger: "axis" },
              xAxis: { type: "category", data: X },
              yAxis: { type: "value", max: 100 },
              series: [{ type: "line", data: loadSeries, smooth: true }],
            }}
          />
        </Col>
        <Col xs={24} md={12}>
          <ReactECharts
            style={{ height: 200 }}
            option={{
              title: {
                text: "Velocity (story points)",
                left: "center",
                textStyle: { fontSize: 14 },
              },
              tooltip: { trigger: "axis" },
              xAxis: { type: "category", data: X },
              yAxis: { type: "value" },
              series: [{ type: "bar", data: velSeries }],
            }}
          />
        </Col>
      </Row>
    </Card>
  );
}
