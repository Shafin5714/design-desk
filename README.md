# Design Desk 🎨

A lightweight, Canva-inspired design editor for creating graphics, presentations, and templates directly in the browser. It allows users to drag and drop elements, add text, shapes, and images, and export their designs in various formats.

## ✨ Features

- **Interactive Canvas Engine:** Built with `react-konva` for high-performance 2D rendering.
- **Drag & Drop Editor:** Seamless manipulation of shapes, text, and images.
- **Asset Management:** Upload and manage personal media, powered by ImageKit.
- **Cloud Saving:** Automatic serialization and syncing of your canvas state to the cloud.
- **Template Library:** Start fresh or use pre-designed templates.

## 🛠️ Tech Stack

Design Desk is built on a modern **MERN** stack utilizing a Microservice architecture, entirely typed with **TypeScript**.

- **Frontend:** Next.js (App Router), Tailwind CSS, React Konva, Zustand, Axios
- **Backend:** Node.js, Express.js (Microservices & API Gateway)
- **Database:** MongoDB (via Mongoose)
- **Asset Storage:** ImageKit
- **Infrastructure:** Docker (Local MongoDB)

## 🏗️ Architecture & Project Structure

This project uses an npm workspaces monorepo structure. For detailed architectural decisions, please read the documentation in the `/docs` folder.

```text
/design-desk
├── /apps             # Next.js frontend applications
│   └── /frontend     # The main canvas editor client
├── /services         # Express.js backend microservices (Auth, Project, Asset, etc.)
├── /packages         # Shared utilities and types
├── /docs             # System architecture and coding guidelines
└── docker-compose.yml # Local database orchestration
```

## 🚀 Getting Started (Local Development)

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for running MongoDB locally)

### 1. Clone & Install
Clone the repository and install dependencies from the root directory using npm workspaces:
```bash
git clone <your-repo-url>
cd design-desk
npm install
```

### 2. Environment Variables
Copy the `.env.example` templates to `.env` files in both the root and specific app/service directories.
```bash
cp .env.example .env
cp apps/frontend/.env.example apps/frontend/.env
```

### 3. Start the Database
Spin up the local MongoDB instance using Docker:
```bash
docker-compose up -d
```

### 4. Run the Development Servers
Start all frontend and backend services concurrently:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000` and the API Gateway at `http://localhost:4000`.

## 📖 Documentation

For AI agents and developers, please review the critical guidelines before contributing:
- [Product Requirements Document (PRD)](./PRD.md)
- [System Architecture](./docs/architecture.md)
- [Tech Stack Details](./docs/tech_stack.md)
- [Coding Guidelines & TypeScript Rules](./docs/coding_guidelines.md)
- [Implementation Roadmap](./docs/implementation_plan.md)
