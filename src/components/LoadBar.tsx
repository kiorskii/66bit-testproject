// src/components/LoadBar.tsx
import { Progress } from "antd";

export default function LoadBar({ v = 0 }: { v: number }) {
  const color = v > 70 ? "#ff4d4f" : v > 30 ? "#faad14" : "#52c41a";
  return (
    <Progress
      percent={v}
      size="small"
      showInfo={false}
      strokeColor={color}
      trailColor="#eee"
      style={{ minWidth: 60 }}
    />
  );
}
