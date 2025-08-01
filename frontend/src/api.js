const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8000";

export async function fetchStatus() {
  const resp = await fetch(`${API_BASE}/status`);
  if (!resp.ok) throw new Error("Network response was not ok");
  return resp.json();
}

export async function fetchMetrics() {
  const res = await fetch(`${API_BASE}/metrics`);
  return res.json();
}

export async function fetchLogs(containerName, lines = 100) {
  const res = await fetch(`${API_BASE}/logs/${containerName}?lines=${lines}`);
  return res.json();
}

export async function triggerDeploy() {
  const res = await fetch(`${API_BASE}/deploy`, {method: "POST"});
  return res.json();
}