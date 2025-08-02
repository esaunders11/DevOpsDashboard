import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function MetricsChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchMetrics = () => {
      fetch("http://localhost:8000/metrics/history")
        .then(res => res.json())
        .then(setData);
    };
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <XAxis dataKey="timestamp" tickFormatter={ts => new Date(ts*1000).toLocaleTimeString()} />
        <YAxis />
        <Tooltip labelFormatter={ts => new Date(ts*1000).toLocaleTimeString()} />
        <Legend />
        <Line type="monotone" dataKey="cpu_percent" stroke="#8884d8" name="CPU %" />
        <Line type="monotone" dataKey="memory_percent" stroke="#82ca9d" name="Memory %" />
        <Line type="monotone" dataKey="disk_percent" stroke="#ffc658" name="Disk %" />
      </LineChart>
    </ResponsiveContainer>
  );
}