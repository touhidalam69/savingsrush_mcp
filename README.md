# SavingsRush MCP Server

TypeScript MCP server for the public SavingsRush API, exposed over Streamable HTTP.

This project wraps SavingsRush data into MCP tools for users, websites, coupons, and blogs, with built-in caching, input normalization, and a simple Express-based HTTP server.

## Features

- Streamable HTTP MCP endpoint at `/mcp`
- Shared in-memory cache with configurable TTL
- Reusable API client with timeout and retry support
- Normalized inputs for user slugs and website URLs
- Structured tool responses for AI clients
- Health check endpoint at `/health`

## Available Tools

The server exposes these MCP tools:

- `list_active_users`
- `get_user`
- `list_websites`
- `list_top_websites`
- `get_coupons`
- `find_coupons_by_site_name`
- `list_blogs`

## Tech Stack

- Node.js
- TypeScript
- Express
- `@modelcontextprotocol/sdk`
- Axios
- Zod

## Project Structure

```text
src/
  config/
  server/
  services/
  tools/
  utils/
  index.ts
```

## Environment Variables

Create a `.env` file in the project root if you want to override defaults.

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

Build the project:

```bash
npm run build
```

Start the compiled server:

```bash
npm start
```

## Endpoints

- `GET /` returns basic server metadata
- `GET /health` returns service health and active session count
- `ALL /mcp` handles MCP Streamable HTTP requests

## How It Works

1. MCP clients connect to `/mcp`
2. The server registers the available tools
3. Tool calls are routed to SavingsRush public API endpoints
4. Responses are transformed into a consistent MCP-friendly format
5. Results are cached in memory to reduce repeated API calls

## SavingsRush API Coverage

This server wraps the following public endpoints:

- `/getActiveVerifiedUsers`
- `/getUserBySlug`
- `/getActiveWebsites`
- `/getTopWebsite`
- `/getCouponsByWebsiteUrl`
- `/getPublishedBlogs`

It also adds one smart helper tool:

- `find_coupons_by_site_name`

That tool resolves a site name to the best matching website and then fetches coupons for it.

## Example Use Cases

- List active SavingsRush users
- Fetch a user by slug
- Browse active or top websites
- Retrieve coupons by website URL
- Find coupons by a partial website name
- List published blog posts

## Development Notes

- Cache TTL defaults to 1 hour
- URL normalization removes protocol, trims casing, and removes trailing slashes
- Slug normalization trims and lowercases input
- The server currently uses in-memory storage only

## Publish Notes

Before publishing to GitHub:

- keep `.env` out of version control
- make sure your `package.json` description, author, keywords, and license are set the way you want
- add screenshots, badges, or MCP client examples if you want a stronger public repo page

## License

This repository currently uses the license declared in `package.json`.
