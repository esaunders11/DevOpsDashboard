# backend/docker_utils.py
import docker

client = docker.from_env()

def get_container_statuses():
    containers = client.containers.list(all=True)
    return {
        c.name: {
            "status": c.status,
            "image": c.image.tags[0] if c.image.tags else "unknown"
        }
        for c in containers
    }

def get_container_logs(container_name: str, lines: int = 100):
    try:
        container = client.containers.get(container_name)
        logs = container.logs(tail=lines).decode("utf-8").splitlines()
        return {"logs": logs}
    except Exception as e:
        return {"error": str(e)}
