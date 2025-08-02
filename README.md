# DevOpsDashboard

DevOpsDashboard is a web-based tool designed to let you monitor and manage your Docker containers, view logs, and deploy with a click. It provides a simple, modern dashboard for DevOps tasks, combining a Python FastAPI backend with a React frontend.

## Features

- **User Authentication**: Register and log in to manage your environment securely.
- **Docker Status Monitoring**: Check if Docker is running and view live container statuses.
- **Container Logs**: View logs for any running Docker container.
- **System Metrics**: Monitor real-time and historical system metrics.
- **One-click Deployment**: Trigger deployments for containers from the dashboard.
- **Simple UI**: Responsive, easy-to-use frontend built with React and Material UI.
- **Backend API**: FastAPI backend with endpoints for registration, login, status, logs, metrics, and deployment.

## Getting Started

### Prerequisites

- **Docker**: Ensure Docker is installed and running on your machine. [Get Docker](https://docs.docker.com/get-docker/)
- **Node.js & npm**: For running the frontend (React).
- **Python 3.8+**: For running the backend (FastAPI).

### Quick Start

#### 1. Clone the repository

```bash
git clone https://github.com/esaunders11/DevOpsDashboard.git
cd DevOpsDashboard
```

#### 2. Backend Setup

1. Navigate to the backend directory:

    ```bash
    cd backend
    ```

2. Install Python dependencies:

    ```bash
    pip install -r requirements.txt
    ```

3. Run the backend server (by default runs on `http://localhost:8000`):

    ```bash
    uvicorn main:app --reload
    ```

#### 3. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:

    ```bash
    cd frontend
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Start the React development server (runs on `http://localhost:3000`):

    ```bash
    npm start
    ```

#### 4. Using the Dashboard

1. Visit [http://localhost:3000](http://localhost:3000) in your browser.
2. Register a new account and log in.
3. Make sure Docker is running locally.
4. Use the dashboard to monitor containers, view logs, and deploy.

## API Endpoints

- `POST /register` — Register a new user
- `POST /login` — Obtain a JWT token
- `GET /verify` — Verify authentication
- `GET /docker-check` — Check if Docker is available
- `GET /status` — Get container statuses
- `GET /logs/{container_name}` — Fetch logs for a container
- `GET /metrics` — Get live system metrics
- `GET /metrics/history` — Get historical metrics
- `POST /deploy` — Trigger deployment for a container

## Project Structure

```
DevOpsDashboard/
├── backend/    # FastAPI backend
├── frontend/   # React frontend
```

## Testing

Backend tests can be run using pytest:

```bash
cd backend
pytest
```

## Notes

- This dashboard requires Docker to be installed and running on your machine.
- API base URL can be customized using the `REACT_APP_API_BASE` environment variable for the frontend.

## License

This project is currently unlicensed. Please add a license if you intend to share or extend this project.

## Author

Created by [esaunders11](https://github.com/esaunders11)
