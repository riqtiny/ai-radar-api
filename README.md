# AI Radar API

A modular, production-ready API service built with **Bun** and **Hono.js**. This service scrapes structured website data from `ai-radar.xyz` and serves it via a RESTful API with a high-performance **Redis** caching layer.

## Features

- **High Performance**: Powered by Bun runtime and Hono.js.
- **Resilient Scraper**: Safely extracts data from embedded JavaScript variables on the target site.
- **Redis Caching**: Includes TTL-based caching with TLS support for cloud-hosted Redis instances.
- **Type Safe**: Strict TypeScript and Zod validation for all data models.
- **Production Ready**: Modular architecture with clear separation of concerns.

## Tech Stack

- **Runtime**: [Bun](https://bun.sh/)
- **Framework**: [Hono.js](https://hono.dev/)
- **Cache**: [Redis](https://redis.io/) (via `ioredis`)
- **Validation**: [Zod](https://zod.dev/)
- **Formatting**: [Prettier](https://prettier.io/)

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed.
- Access to a Redis server (TLS supported).

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

## API Endpoints

- `GET /health`: Service health check.
- `GET /websites`: Fetch all reviewed websites (cached).
- `GET /websites/:hostname`: Fetch detailed data for a specific website.
