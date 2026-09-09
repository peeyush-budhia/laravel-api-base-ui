# Laravel API Base UI

Laravel API Base UI is the React and TypeScript frontend for the [Laravel API Base](https://github.com/peeyush-budhia/laravel-api-base) backend. It provides browser flows for authentication, account activation, profiles, users, roles, permissions, audit logs, and dashboard statistics.

Latest published release: **v0.9.0** (2026-09-07). The
`release/v1.0.0` branch contains the validated v1.0.0 release candidate.

## Requirements

- Node.js 22+
- npm 10+
- A running Laravel API Base backend

## Quick start

```bash
git clone https://github.com/peeyush-budhia/laravel-api-base-ui.git
cd laravel-api-base-ui
npm ci
cp .env.example .env
cp vite.config.example.ts vite.config.ts
npm run dev
```

The UI runs at `http://localhost:5173`. The example environment points to `http://localhost:8000/api/v1`; change `VITE_API_BASE_URL` when the backend uses another host or port. `vite.config.ts` is local-only and ignored by Git.

For the complete two-project setup, see the backend repository's [docs/SETUP_GUIDE.md](https://github.com/peeyush-budhia/laravel-api-base/blob/main/docs/SETUP_GUIDE.md).

## Features

- Sanctum login, logout, token expiry recovery, and password reset
- Administrator-created account activation
- Permission-aware route guards and actions
- User, role, and permission management
- Profile and avatar management
- Dashboard statistics and recent activity
- Audit-log filtering, sorting, pagination, and empty states
- Centralized Axios client and typed API contracts

## Project structure

```text
src/api          API client, endpoints, and feature operations
src/auth         token, session, permissions, and authorization helpers
src/components   reusable and feature-specific UI components
src/pages        route-level screens
src/types        handwritten and OpenAPI-generated TypeScript contracts
src/test         Vitest and Testing Library setup
openapi          committed backend OpenAPI snapshot
scripts          API contract type-generation tooling
docs             development, API, testing, release, and roadmap guidance
```

The backend API is the source of truth for routes, payloads, permissions, and validation. Update the frontend API modules and types when those contracts change.

## Commands

```bash
npm run dev            # start Vite development server
npm run build          # type-check and create the production bundle
npm run api:generate   # regenerate backend-owned enum types from OpenAPI
npm run api:check      # verify committed generated types are current
npm run lint           # run ESLint
npm run format:check   # verify Prettier formatting
npm test               # run the Vitest suite
```

GitHub Actions verifies generated API types, formatting, linting, all tests,
the production build, and the production Nginx image on feature and release
branches and on pull requests.

## Account activation

The backend sends an expiring activation link after a new user is committed. The UI serves `/activate-account`, reads the `email` and `token` query parameters, and submits the chosen password to the backend reset-password endpoint. Run a backend queue worker while testing this flow.

## Documentation

- [Development Guide](docs/DEVELOPMENT.md)
- [Changelog](docs/CHANGELOG.md)
- [Testing Guide](docs/TESTING.md)
- [Frontend API Integration](docs/API.md)
- [Production deployment](docs/PRODUCTION.md)
- [Security and error handling](docs/SECURITY.md)
- [Accessibility review](docs/ACCESSIBILITY.md)
- [Performance review](docs/PERFORMANCE.md)
- [Release Guide](docs/RELEASE.md)
- [Roadmap](docs/ROADMAP.md)
- [Backend setup guide](https://github.com/peeyush-budhia/laravel-api-base/blob/main/docs/SETUP_GUIDE.md)
- [v1.0.0 frontend API contract freeze](docs/API_CONTRACT_FREEZE.md)

The production guide includes an immutable multi-stage Docker image and Nginx
configuration for SPA routing, static-asset caching, security headers, and
readiness checks.

## Contributing and license

Use feature branches, keep backend contracts synchronized, and update tests and documentation with user-facing changes. See the repository license for terms.
