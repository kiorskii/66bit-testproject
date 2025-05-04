// src/screens/Projects.tsx
import { useEffect, useState } from "react";
import { Card, Row, Col, Spin, Tag } from "antd";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

import Header from "../components/Header/Header";
import Navigation from "../components/Navigation/Navigation";
import Footer from "../components/Footer/Footer";
import { fetchProjects } from "../services/project";
import { Project } from "../types";

/* ─── вспомогательная метка приоритета ─── */
function PriorityTag({ p }: { p: Project["priority"] }) {
  const color = p === "High" ? "red" : p === "Med" ? "gold" : "green";
  return <Tag color={color}>{p}</Tag>;
}

export default function Projects() {
  const [list, setList] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setList(await fetchProjects());
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      <Header />
      <Navigation />

      <div
        style={{
          maxWidth: 1300,
          margin: "24px auto",
          height: "10000px",
          width: "100%",
        }}
      >
        <h1 style={{ marginBottom: 24, fontSize: 24, fontWeight: 600 }}>
          Все проекты
        </h1>

        {loading ? (
          <Spin
            size="large"
            style={{ display: "block", margin: "120px auto" }}
          />
        ) : list.length === 0 ? (
          <p style={{ color: "#888" }}>Проектов пока нет.</p>
        ) : (
          <Row gutter={[24, 24]}>
            {list.map((p) => (
              <Col xs={24} md={12} lg={8} key={p.id}>
                <Link to={`/projects/${p.id}`}>
                  <Card hoverable bodyStyle={{ minHeight: 120 }}>
                    <h3 style={{ marginBottom: 4 }}>{p.name}</h3>

                    <PriorityTag p={p.priority} />

                    <p style={{ margin: "8px 0 4px", color: "#666" }}>
                      {p.description?.slice(0, 80) || "Без описания"}
                    </p>

                    <div style={{ fontSize: 13, color: "#888" }}>
                      {dayjs(p.start).format("DD.MM.YY")} –{" "}
                      {dayjs(p.end).format("DD.MM.YY")}
                      <br />
                      Команда: <b>{p.team?.length ?? 0}</b> человек
                    </div>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        )}
      </div>

      <Footer />
    </>
  );
}
