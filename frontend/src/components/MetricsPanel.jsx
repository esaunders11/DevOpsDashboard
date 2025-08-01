import React from "react";

const barStyle = (percent, color) => ({
  height: 16,
  width: `${percent}%`,
  background: color,
  borderRadius: 4,
  transition: "width 0.3s"
});

const MetricsPanel = ({ metrics }) => {
  if (!metrics) return null;
  const { cpu_percent, memory_percent, memory_used, memory_total } = metrics;
  const memUsedGB = (memory_used / 1e9).toFixed(2);
  const memTotalGB = (memory_total / 1e9).toFixed(2);

  return (
    <div style={{ marginBottom: 24 }}>
      <div>
        <b>CPU:</b> {cpu_percent}% 
        <div style={{ background: "#eee", borderRadius: 4 }}>
          <div style={barStyle(cpu_percent, "#4caf50")}></div>
        </div>
      </div>
      <div style={{ marginTop: 12 }}>
        <b>Memory:</b> {memory_percent}% ({memUsedGB} GB / {memTotalGB} GB)
        <div style={{ background: "#eee", borderRadius: 4 }}>
          <div style={barStyle(memory_percent, "#2196f3")}></div>
        </div>
      </div>
    </div>
  );
};

export default MetricsPanel;