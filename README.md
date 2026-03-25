# SavingsRush MCP Server

TypeScript MCP server for the public SavingsRush API, exposed over Streamable HTTP.

This MCP application is published and ready to use here:

- https://mcpize.com/mcp/savingsrush-mcp

## Links

- MCP listing: https://mcpize.com/mcp/savingsrush-mcp
- Main website: https://savingsrush.com
- Author website: https://touhidalam.com

## Overview

This project wraps SavingsRush public APIs into MCP tools for:

- users
- websites
- coupons
- blogs

It includes:

- Streamable HTTP MCP endpoint
- in-memory caching
- input normalization
- reusable API client
- structured tool responses for MCP clients

## Available Tools

- `list_active_users`
- `get_user`
- `list_websites`
- `list_top_websites`
- `get_coupons`
- `find_coupons_by_site_name`
- `list_blogs`

## Environment Variables

```env
PORT=8080
BASE_URL=https://savingsrush.com/api/public
CACHE_TTL=3600
NODE_ENV=production
```

## Getting Started

Install dependencies:

```bash
npm install
```

Run in development:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Start:

```bash
npm start
```

## Endpoints

- `GET /`
- `GET /health`
- `ALL /mcp`

## Main Website

SavingsRush website:

- https://savingsrush.com

## Author

Touhid Alam

- Website: https://touhidalam.com

## License

This repository uses the license declared in `package.json`.
