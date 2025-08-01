import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  LinearProgress,
  Box,
  CircularProgress,
  Collapse,
  IconButton
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const Dashboard = ({ user }) => {
  const [status, setStatus] = useState({});
  const [metrics, setMetrics] = useState({ cpu_percent: 0, memory_percent: 0 });
  const [logs, setLogs] = useState({});
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    const fetchAll = () => {
      fetch("http://localhost:8000/status")
        .then((res) => res.json())
        .then((data) => setStatus(data));
      fetch("http://localhost:8000/metrics")
        .then((res) => res.json())
        .then((m) => setMetrics(m));
      setLoading(false);
    };
    fetchAll();
    const interval = setInterval(fetchAll, 5000);
    return () => clearInterval(interval);
  }, [user, navigate]);

  const fetchLogs = (container) => {
    setLogs((prev) => ({ ...prev, [container]: ["Loading..."] }));
    fetch(`http://localhost:8000/logs/${container}`)
      .then((res) => res.json())
      .then((data) =>
        setLogs((prev) => ({
          ...prev,
          [container]: data.logs || ["No logs to display"],
        }))
      )
      .catch(() =>
        setLogs((prev) => ({
          ...prev,
          [container]: ["Failed to fetch logs"],
        }))
      );
  };

  const handleExpandClick = (container) => {
    setExpanded((prev) => ({
      ...prev,
      [container]: !prev[container],
    }));
    if (!expanded[container]) {
      fetchLogs(container);
    }
  };

  return (
    <Box sx={{ bgcolor: "#f5f7fa", minHeight: "100vh" }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            DevOps Dashboard
          </Typography>
          {user && (
            <>
              <Typography variant="body1" sx={{ mr: 2 }}>
                {user.username}
              </Typography>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4 }}>
        {/* Metrics Bar */}
        <Box sx={{ mb: 3 }}>
          <Typography gutterBottom>CPU Usage</Typography>
          <LinearProgress
            variant="determinate"
            value={metrics.cpu_percent}
            sx={{ height: 10, borderRadius: 5 }}
            color="secondary"
          />
          <Typography variant="caption" sx={{ ml: 1 }}>
            {metrics.cpu_percent}%
          </Typography>

          <Typography gutterBottom sx={{ mt: 2 }}>
            Memory Usage
          </Typography>
          <LinearProgress
            variant="determinate"
            value={metrics.memory_percent}
            sx={{ height: 10, borderRadius: 5 }}
            color="primary"
          />
          <Typography variant="caption" sx={{ ml: 1 }}>
            {metrics.memory_percent}%
          </Typography>
        </Box>

        {loading ? (
          <CircularProgress color="primary" />
        ) : (
          <Grid container spacing={3}>
            {Object.entries(status).map(([name, info]) => (
              <Grid item xs={12} md={6} key={name}>
                <Card
                  sx={{
                    borderLeft: `6px solid ${
                      info.status === "running" ? "#43a047" : "#e53935"
                    }`,
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" color="textPrimary" gutterBottom>
                      {name}
                    </Typography>
                    <Typography color="textSecondary">
                      Status:{" "}
                      <span
                        style={{
                          color:
                            info.status === "running"
                              ? "#43a047"
                              : "#e53935",
                        }}
                      >
                        {info.status}
                      </span>
                    </Typography>
                    <Typography color="textSecondary">
                      Image: {info.image}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      onClick={() => handleExpandClick(name)}
                      endIcon={<ExpandMoreIcon />}
                    >
                      {expanded[name] ? "Hide Logs" : "Show Logs"}
                    </Button>
                  </CardActions>
                  <Collapse in={expanded[name]} timeout="auto" unmountOnExit>
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
                      {logs[name]
                        ? logs[name].map((l, i) => <div key={i}>{l}</div>)
                        : "No logs loaded"}
                    </CardContent>
                  </Collapse>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default Dashboard;