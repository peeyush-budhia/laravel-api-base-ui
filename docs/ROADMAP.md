# Roadmap

## Current

### v1.0.0 — Production Baseline (Release Candidate)

- [x] Freeze compatibility with the backend `/api/v1` contract.
- [x] Generate backend-owned enum types from the committed OpenAPI snapshot.
- [x] Consume backend display labels, descriptions, and semantic tones.
- [x] Complete production configuration and deployment guidance.
- [x] Complete security and error-handling review.
- [x] Complete accessibility review and fixes.
- [x] Complete performance review, route splitting, and unused-code cleanup.
- [x] Establish CI release gates for contract freshness, formatting, linting,
      tests, and production builds.
- [x] Validate a clean installation against the backend release candidate.
- [x] Review and synchronize project documentation.
- [ ] Merge the coordinated backend and frontend release branches.
- [ ] Run final release gates on `main` in both repositories.
- [ ] Create and push matching `v1.0.0` tags.
- [ ] Publish matching GitHub releases.

## Released

### v0.9.0 — Frontend Feature Completeness (2026-09-07)

- Completed automated coverage for supported API services and application
  flows.
- Completed account activation, profile security, permission-aware management,
  dashboard, and audit-log experiences.
- Standardized loading, error, empty, confirmation, validation, and notification
  states.
- Removed obsolete password-change state and unused routed screens.

### v0.8.0 — Frontend Quality and UX (2026-09-03)

- Added dashboard, audit-log, onboarding, and password-policy integration.
- Added shared page states, initial tests, and UX and accessibility improvements.

### v0.7.1 — API Documentation and Integration (2026-08-24)

- Added centralized endpoints, response types, error normalization, API service
  modules, permission-aware authentication, and linked API documentation.

## After v1.0.0

Future work should be driven by published API changes and measured product
needs. Backward-compatible features use minor versions; fixes use patch
versions; breaking API compatibility requires a coordinated major release.
