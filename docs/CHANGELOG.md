# Changelog

Notable changes to Laravel API Base UI are recorded here. The project follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and semantic
versioning.

## [1.0.0] - 2026-09-09

### Added

- Added a production multi-stage Docker image, Nginx SPA configuration,
  readiness check, Compose definition, and Docker CI build.
- Added release-branch Docker and frontend quality gates, immutable asset
  caching, no-store HTML caching, and production security headers.
- Added a committed backend OpenAPI snapshot and dependency-free generated
  TypeScript types for backend-owned `UserStatus` and `AuditEvent` values.
- Added API contract freshness checks to the local workflow and GitHub Actions.
- Added production deployment, security, API contract freeze, accessibility,
  and performance guidance.
- Added route-level lazy loading with an accessible loading state.
- Added broader tests for API services, authentication, authorization, routes,
  forms, and shared UI states.

### Changed

- Set the frontend package metadata to `1.0.0` for the coordinated release.
- Display user-status labels, audit-event labels, permission descriptions, and
  semantic tones supplied by the backend.
- Centralized the mapping from backend semantic tones to this frontend's badge
  colors so another client can use its own visual system.
- Removed the frontend's duplicate status and audit-event unions and color maps;
  generated types now preserve compile-time exhaustiveness.
- Removed unused ecommerce components and assets after verifying that no routed
  application code referenced them.
- Updated production checks to cover formatting, linting, tests, generated API
  types, and the optimized build.

### Fixed

- Improved accessible names, form error relationships, live status messages,
  keyboard behavior, and responsive navigation across primary screens.
- Synchronized active non-remembered authentication sessions between open
  same-origin tabs while keeping their tokens out of persistent storage.
- Kept authentication sessions intact for transient non-401 API failures while
  still clearing invalid sessions on unauthorized responses.

### Validation

- Verified a clean installation with the locked dependency graph.
- Passed 123 frontend tests, formatting, linting, API contract freshness, and
  the production build against the coordinated backend v1.0.0 release.
- Built and inspected the production Nginx image, including the absence of Node
  tooling, the readiness endpoint, and SPA route fallback.

## [0.9.0] - 2026-09-07

### Added

- Completed account activation, profile and security flows, dashboard and audit
  integration, and permission-aware user and role management.
- Added the frontend GitHub Actions quality workflow and comprehensive Vitest
  coverage for the supported application flows.

### Changed

- Moved authenticated password changes into profile security and removed the
  obsolete `must_change_password` client state.
- Standardized shared loading, error, empty, confirmation, and notification
  behavior.

## [0.8.0] - 2026-09-03

### Added

- Added real dashboard, audit-log, account-onboarding, and password-policy API
  integration.
- Added reusable page-state components and initial automated frontend tests.

### Changed

- Improved validation, permission-aware actions, mobile layouts, and feedback
  across authentication, users, roles, audit logs, and profiles.

## [0.7.1] - 2026-08-24

### Added

- Added the centralized API client, endpoint map, normalized errors, shared
  response contracts, and authentication, profile, user, role, and permission
  integrations.
- Added frontend API and development documentation linked to the authoritative
  backend contract.
