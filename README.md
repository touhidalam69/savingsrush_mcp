# SavingsRush MCP Server

TypeScript MCP server for the public SavingsRush API with support for:

- MCP tools
- MCP prompts
- MCP resources
- Streamable HTTP transport
- stdio transport for local desktop/client use

Published listing:

- https://mcpize.com/mcp/savingsrush-mcp

## Overview

This project wraps SavingsRush public API endpoints into an MCP server focused on:

- coupon experts
- websites
- coupons and deals
- blogs

The server exposes one shared MCP definition and can run in two modes:

- `http`: serves MCP over `/mcp` using Streamable HTTP
- `stdio`: serves MCP over stdin/stdout for local MCP clients like Claude Desktop

## Features

- Shared MCP server factory for tools, prompts, and resources
- In-memory caching with configurable TTL
- URL and slug normalization
- Reusable Axios API client with retry handling
- Structured success/error tool responses
- Local stdio support for desktop MCP clients

## Available Tools

- `list_active_coupon_expert`
  Lists active verified coupon experts.
- `get_coupon_expert`
  Gets a coupon expert by `slug`.
- `list_websites`
  Lists active websites on SavingsRush.
- `list_top_websites`
  Lists top websites on SavingsRush.
- `get_coupons`
  Gets coupons for a website `url`. This first checks whether the URL exists in `list_websites`; if not, it returns a coupon-not-available response.
- `list_blogs`
  Lists published blogs.

## Available Prompts

- `find_best_coupons_for_store`
- `recommend_top_stores`
- `show_coupon_expert_profile`

## Available Resources

- `savingsrush://server/about`
- `savingsrush://tools/catalog`
- `savingsrush://examples/sample-queries`

## Project Structure

```text
src/
  config/      Environment and runtime config
  prompts/     MCP prompt definitions and prompt resolution
  resources/   MCP resource definitions and resource reading
  server/      Shared MCP server factory plus HTTP and stdio transports
  services/    API client, cache service, normalizers
  tools/       MCP tool definitions and handlers
  utils/       Logging and response formatting helpers
```

## Environment Variables

```env
PORT=8080
BASE_URL=https://savingsrush.com/api/public
CACHE_TTL=43200
NODE_ENV=production
TRANSPORT=http
```

Notes:

- `CACHE_TTL` is in seconds.
- `TRANSPORT` can be `http` or `stdio`.
- You can also override transport with runtime flags: `--http` or `--stdio`.

## Installation

```bash
npm install
```

## Development

Run in default HTTP mode:

```bash
npm run dev
```

Run explicitly in HTTP mode:

```bash
npm run dev:http
```

Run in stdio mode:

```bash
npm run dev:stdio
```

## Build

```bash
npm run build
```

## Production Run

Start in default HTTP mode:

```bash
npm start
```

Start explicitly in HTTP mode:

```bash
npm run start:http
```

Start in stdio mode:

```bash
npm run start:stdio
```

You can also run the built server directly:

```bash
node dist/index.js --http
node dist/index.js --stdio
```

## HTTP Endpoints

When running in HTTP mode:

- `GET /`
- `GET /health`
- `ALL /mcp`

When running in stdio mode, no HTTP endpoints are exposed.

## Local Claude Desktop Example

Example Windows config for local stdio usage:

```json
{
  "mcpServers": {
    "savingsrush-local": {
      "command": "node",
      "args": [
        "C:\\Github\\savingsrush_mcp\\dist\\index.js",
        "--stdio"
      ],
      "env": {
        "BASE_URL": "https://savingsrush.com/api/public",
        "CACHE_TTL": "43200",
        "NODE_ENV": "production"
      }
    }
  }
}
```

If `node` is not available in PATH, use the full path to `node.exe`.

## Links

- MCP listing: https://mcpize.com/mcp/savingsrush-mcp
- Main website: https://savingsrush.com
- Author website: https://touhidalam.com

## License

This repository uses the license declared in package.json
