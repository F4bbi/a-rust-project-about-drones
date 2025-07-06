# Simulation Controller

A React/Cytoscape-based simulation controller with a Rust backend for managing network topologies, drone operations, and message communication systems.

## 🚀 Quick Start

### Running with Docker (Recommended)

The easiest way to try the simulation controller is using Docker Compose:

```bash
docker compose up
```

This will build and start both the frontend and backend services. The application will be available at `http://localhost:3000`.

## 🛠️ Development Setup

If you want to develop and modify the project, you can run the frontend and backend separately:

### Prerequisites

- **Node.js** (for frontend)
- **Bun** (package manager)
- **Rust** (for backend)
- **Cargo** (Rust package manager)

### Frontend Development

In one terminal, start the frontend development server:

```bash
cd frontend
bun install
bun run dev
```

The frontend will be available at `http://localhost:5173` (Vite default port).

### Backend Development

In another terminal, start the Rust backend:

```bash
cd backend
cargo run
```

The backend API will be available at `http://localhost:3000`.

## 📋 Features

### 🎯 Network Topology Management

- **Interactive Graph Visualization**: Built with Cytoscape.js for creating and managing network topologies
- **Node Types**: Support for drones, servers (communication/content), and clients (chat/web)
- **Edge Management**: Create and remove connections between nodes
- **Real-time Updates**: Dynamic topology modifications

### 🚁 Drone Operations

- **Packet Drop Rate Control**: Set packet drop rates from 0.0 to 1.0 for network simulation
- **Drone Crash Simulation**: Crash drones and automatically disconnect them from the network
- **Status Monitoring**: Track online/offline status of drones

### 💬 Message Communication System

- **Multi-level Message Menu**: Organized message types (Server, Chat, Content requests)
- **Chat Operations**: Join/leave chats, send messages, create/delete chats, get chat lists
- **File Operations**: Public and private file management (list, get, write)
- **Form-based Input**: Dynamic forms for different message types with validation

### 🎨 Modern UI Components

- **Modular Architecture**: Clean separation of concerns with reusable components
- **Responsive Design**: Works across different screen sizes
- **Dark Mode Support**: Built-in dark/light theme switching
- **Interactive Sidebars**: Node details, logs, and control panels
- **Shadcn/UI Integration**: Modern, accessible UI components

## 🏗️ Project Structure

```
simulation-controller/
├── frontend/                 # React + TypeScript frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── custom/       # Custom application components
│   │   │   │   ├── toolbar/  # Toolbar and menu components
│   │   │   │   ├── message/  # Message form components
│   │   │   │   └── topology-visualizer/ # Graph visualization
│   │   │   └── ui/           # Shadcn/UI base components
│   │   ├── stores/           # State management (Zustand)
│   │   ├── pages/            # Application pages
│   │   └── lib/              # Utility functions
│   ├── package.json
│   └── vite.config.ts
├── backend/                  # Rust backend
│   ├── src/
│   │   ├── main.rs           # Application entry point
│   │   ├── network/          # Network message definitions
│   │   └── server/           # Server implementations
│   ├── Cargo.toml
│   └── Cargo.lock
├── docker-compose.yml        # Docker composition
├── Dockerfile               # Container configuration
└── README.md               # This file
```

## 🔧 Technologies Used

### Frontend

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Cytoscape.js** for graph visualization
- **Shadcn/UI** for modern UI components
- **Tailwind CSS** for styling
- **Zustand** for state management
- **Lucide React** for icons

### Backend

- **Rust** with async/await support
- **Serde** for JSON serialization
- **Network message protocol** for communication simulation

### DevOps

- **Docker** for containerization
- **Docker Compose** for multi-service orchestration
- **Bun** for fast package management

## 🎮 Usage Guide

1. **Create Network Topology**:
   - Click the "+" button to add nodes (drones, servers, clients)
   - Select specific node types from the dropdown
   - Draw edges by selecting the edge tool and connecting nodes

2. **Send Messages**:
   - Click the message button and choose message type
   - Fill in required forms for chat operations or file management
   - Select source and destination nodes

3. **Control Drones**:
   - Click on any drone to open the details sidebar
   - Adjust packet drop rates for network simulation
   - Crash drones to simulate network failures

4. **Monitor Activity**:
   - View connection statistics in the node details panel
   - Track packets sent/dropped and success rates
   - Monitor logs in the logs sidebar
