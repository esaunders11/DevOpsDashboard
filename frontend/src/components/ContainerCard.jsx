import React, { useState } from "react";
import { Card, CardContent, CardActions, Typography, Button, Collapse, CircularProgress, Box } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { fetchLogs } from "../api";
import DeployButton from "./DeployButton";

const statusColors = {
  running: "#43a047",
  exited: "#e53935",
  paused: "#ffa726",
  created: "#9e9e9e",
};

const ContainerCard = ({ name, status, image }) => {
  const [showLogs, setShowLogs] = useState(false);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleShowLogs = async () => {
    setShowLogs((prev) => !prev);
    if (!showLogs && logs.length === 0) {
      setLoading(true);
      const res = await fetchLogs(name);
      setLogs(res.logs || ["No logs found"]);
      setLoading(false);
    }
  };

  return (
    <Card
      sx={{
        borderLeft: `6px solid ${statusColors[status] || "black"}`,
        mb: 2,
        boxShadow: 2,
      }}
    >
      <CardContent>
        <Typography variant="h6" color="textPrimary" gutterBottom>
          {name}
        </Typography>
        <Typography color="textSecondary">
          Status:{" "}
          <span style={{ color: statusColors[status] || "black" }}>
            {status}
          </span>
        </Typography>
        <Typography color="textSecondary" sx={{ mt: 0.5 }}>
          Image: <code>{image}</code>
        </Typography>
      </CardContent>
      <CardActions>
        <DeployButton containerName={name} />
        <Button
          size="small"
          onClick={handleShowLogs}
          endIcon={<ExpandMoreIcon />}
        >
          {showLogs ? "Hide Logs" : "Show Logs"}
        </Button>
      </CardActions>
      <Collapse in={showLogs} timeout="auto" unmountOnExit>
        <CardContent
          sx={{
            bgcolor: "#222",
            color: "#fff",
            borderRadius: 1,
            minHeight: 120,
            maxHeight: 200,
            overflowY: "auto",
            fontFamily: "monospace",
            fontSize: "0.85rem",
          }}
        >
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <CircularProgress color="inherit" size={24} />
            </Box>
          ) : (
            logs.map((line, i) => <div key={i}>{line}</div>)
          )}
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default ContainerCard;