import React, { useState } from "react";
import { fetchLogs } from "../api";
import "./ContainerCard.css";

const statusColors = {
  running: "green",
  exited: "red",
  paused: "orange",
  created: "gray",
};

const ContainerCard = ({ name, status, image }) => {
  const [showLogs, setShowLogs] = useState(false);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleShowLogs = async () => {
    setShowLogs(!showLogs);
    if (!showLogs && logs.length === 0) {
      setLoading(true);
      const res = await fetchLogs(name);
      setLogs(res.logs || ["No logs found"]);
      setLoading(false);
    }
  };

  return (
    <div className="container-card">
      <h3>{name}</h3>
      <div>
        Status: <span style={{ color: statusColors[status] || "black" }}>{status}</span>
      </div>
      <div>Image: <code>{image}</code></div>
      <button onClick={handleShowLogs} style={{ marginTop: 8 }}>
        {showLogs ? "Hide Logs" : "Show Logs"}
      </button>
      {showLogs && (
        <div className="container-logs">
          {loading ? "Loading..." : logs.map((line, i) => <div key={i}>{line}</div>)}
        </div>
      )}
    </div>
  );
};

export default ContainerCard;