# API Flux

Design, run, and share API workflows with a visual builder plus a lightweight backend.

Website: https://apiflux.in

![Hero image placeholder](docs/images/apiflux-hero.svg)

## Why API Flux

API Flux helps teams prototype and automate API workflows without wiring up a full backend project each time. Build flows visually, reuse environment configs, and run requests with consistent inputs.

## Features

- Visual webflow editor for API workflows
- **Server-side workflow runs** with saved execution history and a review panel in the editor
- HTTP/API and Transform nodes for orchestration
- Environment files for reusable variables
- File uploads for OpenAPI specs and payloads
- Authenticated user profiles and workspace data

## Architecture

- `Application/UI` - Vue 3 + Vite frontend
- `Application/Backend` - Node.js + Express + SQLite API

![Architecture placeholder](docs/images/architecture.png)

## Quick Start

### Prerequisites

- Node.js `>= 24`
- npm `>= 11`

### Backend

```bash
cd Application/Backend
npm install
cp env.example .env
npm run dev
```

### UI

```bash
cd Application/UI
npm install
npm run dev
```

The UI runs on `http://localhost:5173` and expects the backend on `http://localhost:3000`.

## Configuration

Backend environment variables are documented in `Application/Backend/env.example`.

**Notable security-related settings:**

- **`JWT_SECRET`** — required at startup (minimum 16 characters).
- **`PROXY_ALLOWED_HOSTS`** — comma-separated hostnames the authenticated HTTP proxy may call. In **production**, an allowlist is **required** unless you explicitly set `PROXY_ALLOW_OPEN=true` (not recommended).
- **`CORS_ORIGIN`** — comma-separated allowed browser origins. In production, set this when the UI is on a different origin than the API; in development it defaults to permissive behavior for local tooling.

The Vite dev server proxies `/api` to `http://localhost:3000` so you can run only `npm run dev` in `Application/UI` and still reach the API.

## Product Documentation

See `docs/PRODUCT.md` for user-focused guidance.

## Contributing

1. Fork the repo and create a feature branch.
2. Keep changes scoped and add docs when behavior changes.
3. Open a PR with a clear description and screenshots if UI changes.

## License

Add your license details here.

## Acknowledgments

List key libraries, inspirations, and contributors here.
