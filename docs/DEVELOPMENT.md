# Development Guide

This repository contains the frontend for the Laravel API Base backend.

## Prerequisites

- Node.js
- npm
- The Laravel API Base backend running locally or remotely

## Local Setup

1. Install dependencies.

```bash
npm ci
```

Create the local Vite configuration from the tracked example before running
the development server or production build:

```bash
cp vite.config.example.ts vite.config.ts
```

`vite.config.ts` is local-only and is excluded from Git. Update
`vite.config.example.ts` when shared Vite defaults change.

2. Create a local environment file if needed.

```bash
cp .env.example .env
```

3. Configure the frontend API base URL to point at the backend versioned API.

## Common Scripts

- `npm run dev` starts the Vite development server.
- `npm run build` runs the TypeScript build and creates a production bundle.
- `npm run api:generate` regenerates backend-owned types from the OpenAPI snapshot.
- `npm run api:check` fails when committed generated types are stale.
- `npm run lint` runs ESLint across the project.
- `npm run format:check` verifies Prettier formatting.
- `npm run test` runs the Vitest suite once.
- `npm run test:watch` runs Vitest in watch mode.
- `npm run test:coverage` runs the test suite with coverage enabled.

## Project Structure

- `src/api/` contains API clients and endpoint wrappers.
- `src/auth/` contains authentication state, permissions, and token helpers.
- `src/components/` contains reusable UI and feature components.
- `src/pages/` contains route-level screens.
- `src/types/` contains shared TypeScript types. Backend-owned enums are
  generated in `src/types/generated/api.ts` from `openapi/openapi.json`.

## Backend Alignment

When backend routes, payloads, permissions, or validation rules change:

1. Run `composer contract:export` in the backend repository.
2. Copy backend `docs/openapi.json` to frontend `openapi/openapi.json`.
3. Run `npm run api:generate` and review the generated type changes.
4. Update the relevant API module and handwritten response types.
5. Update the UI and route guards if required.
6. Update the API documentation in `docs/API.md`.
7. Run `npm run api:check`, lint, tests, and the production build.

## Testing Account Onboarding

Run the backend queue worker before creating a user so the activation email is
delivered:

```bash
php artisan queue:work
```

Open the activation link from the email. The frontend route is
`/activate-account`; it reads the `email` and `token` query parameters and sends
the chosen password to the backend reset-password endpoint. Keep the frontend
application URL configured in the backend so generated links point to this UI.
