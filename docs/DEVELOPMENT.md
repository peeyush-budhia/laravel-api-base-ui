# Development Guide

This repository contains the frontend for the Laravel API Base backend.

## Prerequisites

- Node.js
- npm
- The Laravel API Base backend running locally or remotely

## Local Setup

1. Install dependencies.

```bash
npm install
```

2. Create a local environment file if needed.

```bash
cp .env.example .env
```

3. Configure the frontend API base URL to point at the backend versioned API.

## Common Scripts

- `npm run dev` starts the Vite development server.
- `npm run build` runs the TypeScript build and creates a production bundle.
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
- `src/types/` contains shared TypeScript types.

## Backend Alignment

When backend routes, payloads, permissions, or validation rules change:

1. Update the relevant API module.
2. Update the related TypeScript types.
3. Update the UI and route guards if required.
4. Update the API documentation in `docs/API.md`.
5. Update the roadmap or release notes if the change affects delivery status.
