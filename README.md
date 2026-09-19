# Full-Stack Dockerized Todo App 🐳

> [!WARNING]
> **Disclaimer:** This project is built **strictly for learning purposes**. It is designed as an educational exercise to explore containerization, microservices architecture, and modern web development. It is not intended for production use.

A sleek, minimal task management application built to demonstrate a multi-container Docker environment. The project integrates a modern frontend, a robust backend API, a relational database, and a reverse proxy, all orchestrated seamlessly via Docker Compose.

---

## 🛠️ Tech Stack

This project leverages a modern, full-stack ecosystem:

### Frontend (`/client`)
*   **Framework:** [Next.js 16](https://nextjs.org/) (React)
*   **Styling:** Tailwind CSS with custom `oklch` theming
*   **Components:** Custom Shadcn UI implementation
*   **Typography:** JetBrains Mono (monospaced design)
*   **HTTP Client:** Axios

### Backend (`/server`)
*   **Framework:** [FastAPI](https://fastapi.tiangolo.com/) (Python)
*   **ORM / Database:** SQLAlchemy & Psycopg2
*   **Data Validation:** Pydantic

### Infrastructure & Database
*   **Database:** PostgreSQL 16 (Alpine)
*   **Reverse Proxy:** Nginx (Alpine)
*   **Containerization:** Docker & Docker Compose

---

## 📂 Project Structure

```
todo/
├── client/                 # Next.js frontend application
│   ├── app/                # Next.js App Router (pages, api, layouts)
│   ├── components/         # Reusable UI components
│   ├── lib/                # Utility functions
│   ├── Dockerfile          # Multi-stage build for Next.js
│   └── package.json
├── server/                 # FastAPI backend application
│   ├── app/                # Python application code (routes, models)
│   ├── Dockerfile          # Python execution environment
│   └── requirements.txt
├── nginx/                  # Nginx configuration (if applicable)
├── docker-compose.yaml     # Service orchestration configuration
└── README.md               # This file
```

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing.

### Prerequisites

Ensure you have the following installed on your machine:
*   [Docker](https://docs.docker.com/get-docker/)
*   [Docker Compose](https://docs.docker.com/compose/install/)

### Installation & Execution

1.  **Clone the repository** (if you haven't already):
    ```bash
    git clone <your-repo-url>
    cd todo
    ```

2.  **Environment Variables**:
    Create `.env` files in both the `/client` and `/server` directories if specific environment configurations are needed. (By default, `docker-compose.yaml` injects the necessary database credentials).

3.  **Build and Run with Docker Compose**:
    From the root of the project, run:
    ```bash
    docker compose up --build
    ```
    *Add the `-d` flag to run the containers in detached mode (background).*

### Accessing the Services

Once the containers are successfully running, you can access the services at the following URLs:

*   **Frontend (Next.js):** [http://localhost:3000](http://localhost:3000)
*   **Backend API (FastAPI):** [http://localhost:8000](http://localhost:8000)
*   **API Documentation (Swagger UI):** [http://localhost:8000/docs](http://localhost:8000/docs)
*   **Nginx Proxy:** [http://localhost:80](http://localhost:80)

---

## 🛑 Stopping the Application

To gracefully stop the running containers, press `Ctrl+C` in the terminal where Docker Compose is running. If running in detached mode, execute:

```bash
docker compose down
```

To stop and remove all volumes (this will **delete all your saved tasks** in the database):

```bash
docker compose down -v
```

---

## 🎨 Design Philosophy

The frontend was designed with a "physical paper list" aesthetic in mind. It explicitly rejects the common rounded-card/drop-shadow aesthetic in favor of:
*   A flat list with hairline rules.
*   A strict monochromatic base (Ink & Paper) with a single, highly deliberate **Canary Yellow** accent.
*   Monospaced typography (JetBrains Mono) that treats every task with equal weight.

---

> Built as an exercise in full-stack Docker development.
