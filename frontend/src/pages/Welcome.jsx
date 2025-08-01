import React from "react";
import { Box, Typography, Paper, List, ListItem, Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function Welcome() {
  return (
    <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
      <Paper elevation={4} sx={{ p: 4, maxWidth: 600 }}>
        <Typography variant="h4" gutterBottom>
          Welcome to DevOps Dashboard
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          This site lets you monitor and manage your Docker containers, view logs, and deploy with a click.
        </Typography>
        <Typography variant="h6">To get started:</Typography>
        <List>
          <ListItem>1. Register for a free account</ListItem>
          <ListItem>2. Log in with your credentials</ListItem>
          <ListItem>3. Make sure Docker is installed and running on your machine</ListItem>
          <ListItem>4. Use the dashboard to view and control your containers!</ListItem>
        </List>
        <Typography variant="body2" sx={{ mt: 2 }}>
          <b>Note:</b> This dashboard requires <a href="https://docs.docker.com/get-docker/" target="_blank" rel="noopener noreferrer">Docker</a> installed locally.
        </Typography>
        <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
          <Button component={Link} to="/register" variant="contained" color="primary">
            Register
          </Button>
          <Button component={Link} to="/login" variant="outlined" color="primary">
            Log In
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}