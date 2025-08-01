# backend/deploy.py
import subprocess

def pull_and_restart():
    try:
        # Pull latest changes from Git
        subprocess.run(["git", "pull"], check=True)

        # Restart container(s)
        subprocess.run(["docker-compose", "down"], check=True)
        subprocess.run(["docker-compose", "up", "-d"], check=True)

        return {"status": "Deployment triggered successfully"}
    except subprocess.CalledProcessError as e:
        return {"error": str(e)}
