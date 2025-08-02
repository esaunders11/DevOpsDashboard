import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Box,
  CircularProgress,
  Button
} from "@mui/material";
import MetricsPanel from "../components/MetricsPanel";
import MetricsChart from "../components/MetricsChart";
import ContainerCard from "../components/ContainerCard";

const Dashboard = ({ user }) => {
  const [status, setStatus] = useState({});
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
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
        <MetricsPanel metrics={metrics} />
        <MetricsChart />
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {Object.entries(status).map(([name, info]) => (
              <Grid item xs={12} md={6} key={name}>
                <ContainerCard
                  name={name}
                  status={info.status}
                  image={info.image}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default Dashboard;