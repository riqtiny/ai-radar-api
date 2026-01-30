# AI Radar API

A modular, production-ready API service built with **Bun** and **Hono.js**. This service scrapes structured website data from `ai-radar.xyz` and serves it via a RESTful API with a high-performance **Redis** caching layer.

## Features

- **High Performance**: Powered by Bun runtime and Hono.js.
- **Interactive API Docs**: Built-in Scalar UI for easy endpoint testing.
- **AI-Friendly (Vibe Code)**: Clean OpenAPI specification for AI coding agents.
- **Resilient Scraper**: Safely extracts data from embedded JavaScript variables on the target site.
- **Redis Caching**: Includes TTL-based caching with TLS support.
- **Type Safe**: End-to-end type safety using `@hono/zod-openapi`.

## Tech Stack

- **Runtime**: [Bun](https://bun.sh/)
- **Framework**: [Hono.js](https://hono.dev/) & [Zod OpenAPI](https://github.com/honojs/middleware/tree/main/packages/zod-openapi)
- **API Reference**: [Scalar](https://scalar.com/)
- **Cache**: [Redis](https://redis.io/) (via `ioredis`)
- **Validation**: [Zod](https://zod.dev/)

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed.
- Access to a Redis server.

### Installation

```bash
bun install
```

### Configuration

Create a `.env` file in the root directory:

```env
PORT=3000
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=your-password
REDIS_TLS=true
```

### Development

```bash
# Start the server
bun run src/index.ts

# Format code
bun run format
```

## API Documentation

The API includes built-in interactive documentation and machine-readable specifications:

- **Interactive Reference**: [http://localhost:3000/reference](http://localhost:3000/reference) (Scalar UI)
- **OpenAPI JSON**: [http://localhost:3000/doc](http://localhost:3000/doc)

### Vibe Code Support
This API is optimized for "vibe coding". AI agents (like Cursor, Windsurf, or Claude Code) can easily understand the entire API structure by consuming the OpenAPI spec at `/doc`.

## API Endpoints

- `GET /health`: Service health check.
- `GET /doc`: OpenAPI 3.0.0 JSON specification.
- `GET /reference`: Interactive API documentation (Scalar).
- `GET /websites`: Fetch all reviewed websites (cached).
- `GET /websites/:hostname`: Fetch detailed data for a specific website.
