import subprocess

def pull_and_restart_container(container_name: str):
    try:
        subprocess.run(["git", "pull"], check=True)
        subprocess.run(["docker-compose", "restart", container_name], check=True)
        return {"status": f"Deployment triggered successfully for {container_name}"}
    except subprocess.CalledProcessError as e:
        return {"error": str(e)}
