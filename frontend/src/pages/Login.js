import React, { useState } from "react";
import { Box, Paper, Typography, TextField, Button, Alert } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";

export default function Login({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    fetch("http://localhost:8000/login", {
      method: "POST",
      body: new URLSearchParams({ username, password }),
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })
      .then((res) => res.ok ? res.json() : Promise.reject(res))
      .then((data) => {
        localStorage.setItem("token", data.access_token);

        fetch("http://localhost:8000/verify", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${data.access_token}`
          }
        })
          .then(res => res.json())
          .then(verifyData => {
            if (verifyData.verified) {
              setUser({ username });
              navigate("/dashboard");
            } else {
              setUser(null);
              setError("Verification failed after login.");
            }
          });

      })
      .catch(() => {
        setError("Invalid username or password");
      });
  };

  return (
    <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
      <Paper elevation={4} sx={{ p: 4, maxWidth: 400 }}>
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleLogin}>
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
            required
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Login
          </Button>
        </form>
        <Typography sx={{ mt: 2 }} align="center">
          Don't have an account? <Link to="/register">Register</Link>
        </Typography>
      </Paper>
    </Box>
  );
}