# Testing Guide

This project uses Vitest with React Testing Library and jsdom.

## Setup

The test runner is configured in `vitest.config.ts`.

Global test setup lives in `src/test/setup.ts`.

## Commands

- `npm run test` runs the full test suite once.
- `npm run test:watch` keeps the test runner active during development.
- `npm run test:coverage` runs coverage reporting.

## Current Coverage Areas

The repository includes tests for:

- API client and feature service modules
- Authentication flows
- Permission and route guards
- Password policy validation
- Common loading, error, and empty states
- Password change UI behavior

## Writing Tests

Prefer focused tests that assert user-visible behavior and API contract handling.

Typical patterns in this codebase:

- Mock API modules rather than calling the backend directly.
- Use React Testing Library for component and page tests.
- Keep setup helpers in `src/test/`.
- Test normalized error handling rather than Axios-specific internals.

## Test Maintenance

When changing routes, permissions, validation, or API behavior, update the affected tests in the same change set.

