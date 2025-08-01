import React, { useState } from "react";
import { triggerDeploy } from "../api";

const DeployButton = ({ onDeploy }) => {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const handleClick = async () => {
    setLoading(true);
    setMsg(null);
    try {
      const res = await triggerDeploy();
      setMsg(res.status || res.error || "Unknown response");
      if (onDeploy) onDeploy();
    } catch (e) {
      setMsg("Deploy failed");
    }
    setLoading(false);
  };

  return (
    <div style={{ marginBottom: 24 }}>
      <button onClick={handleClick} disabled={loading}>
        {loading ? "Deploying..." : "Manual Deploy"}
      </button>
      {msg && (
        <div style={{ marginTop: 8, color: msg.startsWith("Deploy") ? "red" : "green" }}>
          {msg}
        </div>
      )}
    </div>
  );
};

export default DeployButton;