# Testing Guide

This project uses Vitest with React Testing Library and jsdom.

## Setup

The test runner is configured in `vitest.config.ts`. The Vite build
configuration is copied from `vite.config.example.ts` to the ignored local
`vite.config.ts` during setup and CI.

Global test setup lives in `src/test/setup.ts`.

## Commands

- `npm test` runs the full test suite once.
- `npm run test:watch` keeps the test runner active during development.
- `npm run test:coverage` runs coverage reporting.
- `npm run api:check` verifies that committed generated API types match the
  committed OpenAPI snapshot.

## Current Coverage Areas

The repository includes tests for:

- API client and feature service modules
- Authentication flows
- Permission and route guards
- Password policy validation
- Common loading, error, and empty states
- Password change UI behavior
- Account activation, profile, user, role, dashboard, and audit-log pages
- Backend-provided status and audit metadata with semantic tone rendering

## Writing Tests

Prefer focused tests that assert user-visible behavior and API contract handling.

Typical patterns in this codebase:

- Mock API modules rather than calling the backend directly.
- Use React Testing Library for component and page tests.
- Keep setup helpers in `src/test/`.
- Test normalized error handling rather than Axios-specific internals.

## Test Maintenance

When changing routes, permissions, validation, or API behavior, update the affected tests in the same change set.

## Continuous Integration

The GitHub Actions workflow in `.github/workflows/quality.yml` runs on pushes
to `main`, `develop`, feature branches, and release branches, and on pull
requests targeting `main` or `develop`. It installs the locked dependencies
and requires all of the following checks to pass:

- `npm run format:check`
- `npm run lint`
- `npm run api:check`
- `npm test`
- `npm run build`

Run the same commands locally before opening a pull request. The v1.0.0 clean
release-candidate installation passes 123 tests as well as formatting, lint,
contract freshness, and production-build checks.

The separate `.github/workflows/docker.yml` workflow builds the final Nginx
image with a production API URL. Before release, validate the image locally:

```bash
docker build \
  --build-arg VITE_APP_ENV=production \
  --build-arg VITE_API_BASE_URL=https://api.example.com/api/v1 \
  --tag laravel-api-base-ui:release .
docker run --rm laravel-api-base-ui:release nginx -t
```

The final image must contain `dist/` and Nginx, exclude Node tooling, return
`ok` from `/healthz`, and serve `index.html` for client-side routes.
