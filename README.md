# A Rust project about drones, clients and servers

This repository combines the UI and the core of a team project developed for the _Advanced Programming_ course at the **University of Trento** during the 2024/2025 academic year.

You can find the backend part (which simulates the network and nodes behavior) in the backend submodule.

## 🎯 Project Overview

In simple terms, the project is a simulation of how the internet works, but instead of routers, we have drones that can crash or lose packets, just like real drones!
Clients can communicate with servers to write and save files, communicate with other clients by creating chats and sending messages (check out the showcase section below for a full tour of features).

## 🛠️ Technologies Used

- **Bun** for fast package management
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Cytoscape.js** for graph visualization
- **Shadcn/UI** for modern UI components
- **Tailwind CSS** for styling
- **Zustand** for state management
- **Lucide React** for icons

For backend technologies, see the [backend documentation](https://github.com/LuigiMiazzo17/unitn-advancedProgramming-WGL_2024-rust/tree/master/README.md).

## 🧪 Building & Developing the Project

### Running with Docker (Recommended)

The easiest way to try locally the project is using Docker Compose:

```bash
docker compose up
```

This will build and start both the frontend and backend services. The application will be available at `http://localhost:3000`.

### Development Setup

If you want to develop and modify the project, you can run the frontend and backend separately.

#### Prerequisites

- **Node.js** (for frontend)
- **Bun** (package manager)
- **Rust** (for backend)
- **Cargo** (Rust package manager)

#### Frontend Development

In one terminal, start the frontend development server:

```bash
cd frontend
bun install
bun run dev
```

The frontend will be available at `http://localhost:5173` (Vite default port).

#### Backend Development

In another terminal, start the Rust backend:

```bash
cd backend
cargo run
```

The backend API will be available at `http://localhost:3000`.

## 📄 Want to learn more?

If you're curious about how communication between nodes works, how each node becomes aware of the network topology, or other technical aspects of the simulation, feel free to check out the [backend part](https://github.com/LuigiMiazzo17/unitn-advancedProgramming-WGL_2024-rust/tree/master).