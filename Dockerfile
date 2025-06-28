# Frontend
FROM oven/bun:latest AS deps-frontend
WORKDIR /app
COPY frontend/package.json frontend/bun.lock ./
RUN bun install --frozen-lockfile

FROM oven/bun:latest AS build-frontend
WORKDIR /app
COPY --from=deps-frontend /app/node_modules ./node_modules
COPY frontend/ .

RUN bun run build

# Backend
FROM rust:latest AS build-backend
WORKDIR /app

COPY backend/Cargo.toml backend/Cargo.lock ./
COPY backend/src ./src
RUN cargo install cargo-watch
RUN cargo build --release

# Development stage with both Rust and Bun
FROM rust:latest AS development
WORKDIR /app

# Install cargo-watch for hot reloading
RUN cargo install cargo-watch

# Install Bun
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:$PATH"

# Create directories for volume mounts
RUN mkdir -p /app/backend /app/frontend

# Release
FROM debian:bookworm-slim
WORKDIR /app

COPY --from=build-backend /app/target/release/backend ./backend
COPY --from=build-frontend /app/dist ./dist

EXPOSE 3000

ENTRYPOINT ["./backend"]
