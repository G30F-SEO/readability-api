# CLAUDE.md — Readability API

## Project Overview

A lightweight Node.js webhook API that extracts readable content from webpages using Mozilla's [Readability.js](https://github.com/mozilla/readability). It fetches a URL, parses the HTML, and returns clean article text, title, excerpt, and byline.

## Tech Stack

- **Runtime:** Node.js (CommonJS modules)
- **Framework:** Express
- **HTTP Client:** Axios
- **HTML Parsing:** JSDOM + @mozilla/readability
- **No TypeScript, no build step** — plain JavaScript, runs directly with `node`

## Project Structure

```
readability-api/
├── index.js         # Entire application — Express server with single /parse endpoint
├── package.json     # Dependencies and start script
└── CLAUDE.md        # This file
```

This is a single-file application. All logic lives in `index.js`.

## Getting Started

```bash
npm install
npm start          # or: node index.js
```

The server listens on `PORT` env var (default: `3000`).

## API

### POST /parse

Extracts readable content from a URL.

**Request:**
```json
{ "url": "https://example.com/article" }
```

**Success response (200):**
```json
{
  "title": "Article Title",
  "content": "Extracted text (max 10,000 chars)",
  "excerpt": "Article excerpt or null",
  "byline": "Author name or null"
}
```

**Error responses:**
- `400` — Missing `url` in request body
- `500` — Fetch failure, parse failure, or unreadable content

## Key Implementation Details

- Content is truncated to **10,000 characters** (`article.textContent.slice(0, 10000)`)
- HTTP requests use a **10-second timeout** and a generic `User-Agent: Mozilla/5.0` header
- JSDOM receives the original URL for proper relative URL resolution
- The app is **stateless** — no database, no caching, no persistent storage

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT`   | `3000`  | Server listen port |

## Development Notes

- **No tests** — there is no test framework or test suite configured
- **No linter/formatter** — no ESLint or Prettier configuration
- **No CI/CD** — no GitHub Actions or deployment pipeline
- **No .gitignore** — `node_modules` should be excluded manually if needed
- **No Docker** — no containerization config

## Code Conventions

- CommonJS `require()` imports (not ES modules)
- Async route handlers with try/catch error handling
- JSON request/response throughout
- Minimal dependencies — only what's needed

## Common Tasks

| Task | Command |
|------|---------|
| Install dependencies | `npm install` |
| Start the server | `npm start` |
| Test the endpoint | `curl -X POST http://localhost:3000/parse -H "Content-Type: application/json" -d '{"url":"https://example.com"}'` |
