import pytest
from fastapi.testclient import TestClient
import backend.main as main_mod
import os
from sqlalchemy import create_engine, text

client = TestClient(main_mod.app)

def get_database_url():
    return os.getenv("DATABASE_URL", "sqlite:///./local.db")

def test_database_connection():
    db_url = get_database_url()
    engine = create_engine(db_url, connect_args={"check_same_thread": False} if db_url.startswith("sqlite") else {})
    with engine.connect() as conn:
        result = conn.execute(text("SELECT 1")).scalar()
        assert result == 1

def test_register_and_login():
    username = "testuser"
    password = "testpass"

    response = client.post("/register", json={"username": username, "password": password})
    assert response.status_code in [200, 400] 

    response = client.post("/login", data={"username": username, "password": password})
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data

def test_docker_check():
    response = client.get("/docker-check")
    assert response.status_code == 200
    data = response.json()
    assert "docker" in data
    assert isinstance(data["docker"], bool)

def test_status_endpoint(monkeypatch):
    monkeypatch.setattr(main_mod, "get_container_statuses", lambda: {
        "web": {"status": "running", "image": "nginx:latest"}
    })
    resp = client.get("/status")
    assert resp.status_code == 200
    data = resp.json()
    assert "web" in data
    assert data["web"]["status"] == "running"

def test_logs_endpoint(monkeypatch):
    monkeypatch.setattr(main_mod, "get_container_logs", lambda name, lines=100: {"logs": ["log1", "log2"]})
    resp = client.get("/logs/web")
    assert resp.status_code == 200
    data = resp.json()
    assert "logs" in data
    assert data["logs"] == ["log1", "log2"]

def test_metrics_endpoint(monkeypatch):
    monkeypatch.setattr(main_mod, "get_system_metrics", lambda: {
        "cpu_percent": 12,
        "memory_used": 123456,
        "memory_total": 654321,
        "memory_percent": 30
    })
    resp = client.get("/metrics")
    assert resp.status_code == 200
    data = resp.json()
    assert "cpu_percent" in data and "memory_percent" in data

# def test_deploy_endpoint(monkeypatch):
#     monkeypatch.setattr(main_mod, "pull_and_restart", lambda: {"status": "success"})
#     resp = client.post("/deploy")
#     assert resp.status_code == 200
#     assert resp.json()["status"] == "success"