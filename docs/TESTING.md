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
to `main`, `develop`, and feature branches, and on pull requests targeting
`main` or `develop`. It installs the locked dependencies and requires all of
the following checks to pass:

- `npm run format:check`
- `npm run lint`
- `npm run api:check`
- `npm test`
- `npm run build`

Run the same commands locally before opening a pull request. The v1.0.0 clean
release-candidate installation passes 123 tests as well as formatting, lint,
contract freshness, and production-build checks.
