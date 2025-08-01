import backend.docker_utils as docker_utils

def test_get_container_statuses(monkeypatch):
    class MockContainer:
        def __init__(self, name, status, image_tag):
            self.name = name
            self.status = status
            self.image = type("Image", (), {"tags": [image_tag]})()

    mock_containers = [
        MockContainer("web", "running", "nginx:latest"),
        MockContainer("db", "exited", "postgres:alpine"),
    ]

    monkeypatch.setattr(
        "docker.models.containers.ContainerCollection.list",
        lambda self, all=True: mock_containers
    )
    statuses = docker_utils.get_container_statuses()
    assert "web" in statuses
    assert statuses["web"]["status"] == "running"
    assert statuses["db"]["image"] == "postgres:alpine"

def test_get_container_logs(monkeypatch):
    class MockContainer:
        def logs(self, tail):
            return b"line1\nline2\n"

    monkeypatch.setattr(
        "docker.models.containers.ContainerCollection.get",
        lambda self, name: MockContainer()
    )
    logs = docker_utils.get_container_logs("web")
    assert "logs" in logs
    assert logs["logs"] == ["line1", "line2"]