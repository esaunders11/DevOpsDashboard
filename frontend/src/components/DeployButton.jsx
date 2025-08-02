import React, { useState } from "react";
import { Button, Box, Typography, CircularProgress, Alert } from "@mui/material";
import { triggerDeploy } from "../api";

const DeployButton = ({ containerName, onDeploy }) => {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const handleClick = async () => {
    setLoading(true);
    setMsg(null);
    try {
      const res = await triggerDeploy(containerName);
      setMsg(res.status || res.error || "Unknown response");
      if (onDeploy) onDeploy();
    } catch (e) {
      setMsg("Deploy failed");
    }
    setLoading(false);
  };

  return (
    <Box sx={{ mb: 1, display: "flex", alignItems: "center", gap: 2 }}>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleClick}
        disabled={loading}
        sx={{ minWidth: 140 }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "Deploy"}
      </Button>
      {msg && (
        <Alert
          severity={msg.toLowerCase().includes("fail") ? "error" : "success"}
          sx={{ ml: 2 }}
        >
          {msg}
        </Alert>
      )}
    </Box>
  );
};

export default DeployButton;