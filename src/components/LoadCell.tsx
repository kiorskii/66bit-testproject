// src/components/LoadCell.tsx
export default function LoadCell({ v = 0 }: { v: number }) {
  const color = v > 70 ? "#ff4d4f" : v > 30 ? "#faad14" : "#52c41a"; // red/yellow/green
  return (
    <div
      style={{
        width: 46,
        textAlign: "center",
        padding: "2px 6px",
        borderRadius: 4,
        background: color,
        color: "#fff",
        fontSize: 12,
      }}
    >
      {v}%
    </div>
  );
}
