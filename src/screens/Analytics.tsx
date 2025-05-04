import { useEffect, useRef, useState } from "react";
import { Card, Tabs, Row, Col, Spin, Button } from "antd";
import loadable from "@loadable/component";
import {
  askAnalyticsSummary,
  fetchAnalytics,
  fetchAnalyticsRange,
} from "../services/analytics";
import Header from "../components/Header/Header";
import Navigation from "../components/Navigation/Navigation";
import Footer from "../components/Footer/Footer";
import { Segmented, DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { RobotOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const ReactECharts = loadable(() => import("echarts-for-react"));

export default function Analytics() {
  const [period, setPeriod] = useState<"weekly" | "monthly">("weekly");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"weekly" | "monthly" | "custom">("weekly");
  const [range, setRange] = useState<[Dayjs, Dayjs] | null>(null);
  const navigate = useNavigate();

  const [typing, setTyping] = useState(false);
  const [typed, setTyped] = useState("");
  const typingRef = useRef<NodeJS.Timeout>();

  /* state */
  const [sumChat, setSumChat] = useState<
    { role: "user" | "ai"; text: string; ts: number }[]
  >([]);
  const [sumLoading, setSumLoading] = useState(false);

  /* отправка запроса */
  const getSummary = async () => {
    if (typing) return; // не перебиваем
    setSumChat([]);
    setTyped("");
    setTyping(true);

    const payload =
      mode === "custom" && range
        ? {
            period: "custom",
            start: range[0].format("YYYY-MM-DD"),
            end: range[1].format("YYYY-MM-DD"),
          }
        : { period: mode };

    // маленькая пауза «думает…»
    await new Promise((r) => setTimeout(r, 400));

    const { reply } = await askAnalyticsSummary(payload);

    let idx = 0;
    typingRef.current = setInterval(() => {
      idx += 2; // 2 символа за тик ~50cps
      setTyped(reply.slice(0, idx));
      if (idx >= reply.length) {
        clearInterval(typingRef.current!);
        setTyping(false);
      }
    }, 40);
  };
  useEffect(() => () => clearInterval(typingRef.current!), []);

  /* загрузка */
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        if (mode === "custom" && range) {
          const res = await fetchAnalyticsRange(
            range[0].format("YYYY-MM-DD"),
            range[1].format("YYYY-MM-DD")
          );
          setData(res.data);
        } else {
          const res = await fetchAnalytics(mode as any);
          setData(res.data);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [mode, range]);

  /* helpers для графиков */
  const X =
    mode === "weekly"
      ? data.map((d) => d.week)
      : mode === "monthly"
      ? data.map((d) => d.month)
      : data.map((d) => d.day);

  const loadSeries = data.map((d) => d.avgLoad);
  const velSeries = data.map((d) => d.velocity);
  const riskSeries = data.map((d) => d.risk);
  const costSeries = data.map((d) => d.cost);
  const budgetSeries = data.map((d) => d.budget);

  /* stack aggregation (последняя точка) */
  const stackLast = data.length ? data[data.length - 1].stack : {};
  const stackNames = Object.keys(stackLast);
  const stackValues = stackNames.map((n) => ({ name: n, value: stackLast[n] }));

  return (
    <>
      <Header />
      <Navigation />
      <div style={{ maxWidth: 1300, margin: "24px auto" }}>
        <h1 style={{ marginBottom: 24 }}>Аналитика эффективности</h1>

        <Row gutter={12} style={{ marginBottom: 24 }}>
          <Col>
            <Segmented
              options={[
                { label: "Недели", value: "weekly" },
                { label: "Месяцы", value: "monthly" },
                { label: "Диапазон", value: "custom" },
              ]}
              value={mode}
              onChange={(v) => setMode(v as any)}
            />
          </Col>

          {mode === "custom" && (
            <Col>
              <DatePicker.RangePicker
                allowClear={false}
                value={range || [dayjs().subtract(13, "day"), dayjs()]}
                onChange={(v) => setRange(v as any)}
                format="DD.MM.YY"
              />
            </Col>
          )}
        </Row>

        {loading ? (
          <Spin
            size="large"
            style={{ display: "block", margin: "120px auto" }}
          />
        ) : (
          <Row gutter={[24, 24]}>
            {/* блок 1: Загрузка + Velocity */}
            <Col xs={24} md={12}>
              <Card title="Средняя загрузка (%)">
                <ReactECharts
                  option={{
                    tooltip: { trigger: "axis" },
                    xAxis: { type: "category", data: X },
                    yAxis: { type: "value", max: 100 },
                    series: [{ type: "line", data: loadSeries, smooth: true }],
                  }}
                />
                <p style={{ fontSize: 13, color: "#888", marginTop: 6 }}>
                  Показывает средний процент занятости команды в выбранном
                  периоде. Значение выше&nbsp;80 % — индикатор перегрузки.
                </p>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title="Velocity (story points)">
                <ReactECharts
                  option={{
                    tooltip: { trigger: "axis" },
                    xAxis: { type: "category", data: X },
                    yAxis: { type: "value" },
                    series: [{ type: "bar", data: velSeries }],
                  }}
                />
                <p style={{ fontSize: 13, color: "#888", marginTop: 6 }}>
                  Кол-во выполненных story&nbsp;points. Рост velocity говорит о
                  повышении эффективности разработки.
                </p>
              </Card>
            </Col>

            {/* блок 2: Риск-индекс */}
            <Col xs={24} md={12}>
              <Card title="Индекс риска проектов">
                <ReactECharts
                  option={{
                    tooltip: { trigger: "axis" },
                    xAxis: { type: "category", data: X },
                    yAxis: { type: "value", max: 100 },
                    series: [{ type: "line", data: riskSeries, areaStyle: {} }],
                  }}
                />
              </Card>
            </Col>

            {/* блок 3: Распределение stack */}
            <Col xs={24} md={12}>
              <Card title="Стек-распределение сотрудников (текущая дата)">
                <ReactECharts
                  option={{
                    tooltip: { trigger: "item" },
                    series: [
                      {
                        type: "pie",
                        radius: ["40%", "70%"],
                        data: stackValues,
                        label: { formatter: "{b}: {d}%" },
                      },
                    ],
                  }}
                />
              </Card>
            </Col>

            {/* блок 4: Финансы + Отсутствия */}
            <Col xs={24}>
              <Card title="Финансовая эффективность и отсутствие">
                <ReactECharts
                  option={{
                    tooltip: { trigger: "axis" },
                    legend: { data: ["Стоимость", "Бюджет"] },
                    xAxis: { type: "category", data: X },
                    yAxis: { type: "value" },
                    series: [
                      { name: "Стоимость", type: "bar", data: costSeries },
                      { name: "Бюджет", type: "bar", data: budgetSeries },
                    ],
                  }}
                />
                <p style={{ marginTop: 12, color: "#888" }}>
                  Отпуска/отсутствия (последняя точка):{" "}
                  <b>{data[data.length - 1]?.absences ?? 0}</b> человек
                </p>
              </Card>
            </Col>
          </Row>
        )}
        <Row style={{ marginTop: 24 }}>
          <Col xs={24}>
            <Card
              title="AI-сводка периода"
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
                  Нажмите «Сформировать», чтобы получить краткий анализ метрик.
                </p>
              )}
              <Button
                type="link"
                style={{ padding: 0 }}
                onClick={() => {
                  const att =
                    mode === "custom" && range
                      ? {
                          type: "analytics",
                          period: "custom",
                          start: range[0].format("YYYY-MM-DD"),
                          end: range[1].format("YYYY-MM-DD"),
                        }
                      : { type: "analytics", period: mode };
                  navigate("/assistant", { state: { attachment: att } });
                }}
              >
                Узнать больше по данной статистике у ассистента
              </Button>
            </Card>
          </Col>
        </Row>
      </div>
      <Footer />
    </>
  );
}
