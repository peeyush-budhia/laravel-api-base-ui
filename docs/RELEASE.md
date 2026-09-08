# Release Notes

The latest published release is **v0.9.0**, released on 2026-09-07. The
`release/v1.0.0` branch is the validated v1.0.0 release candidate.

## v1.0.0 — Unreleased

v1.0.0 establishes the production baseline shared with Laravel API Base. The
frontend is frozen against the backend `/api/v1` contract and has been
validated from a clean installation.

### API contract

- Committed the coordinated backend OpenAPI snapshot under `openapi/`.
- Generate `UserStatus` and `AuditEvent` from backend schemas with
  `npm run api:generate`.
- Enforce generated-type freshness with `npm run api:check` locally and in CI.
- Consume backend labels, descriptions, and semantic tones while mapping tones
  to local component colors through one reusable adapter.

### Production readiness

- Added production configuration, SPA hosting, CORS coordination, queue-worker
  dependency, security, accessibility, and performance guidance.
- Hardened session handling so only unauthorized responses clear the stored
  token.
- Added route-level lazy loading and removed unused ecommerce code and assets.
- Improved accessible controls, validation messages, live status feedback,
  navigation, and responsive layouts.

### Quality gates

- GitHub Actions checks formatting, ESLint, generated API types, all tests, and
  the production build.
- The clean release-candidate installation passes 120 tests plus formatting,
  linting, contract freshness, and production build validation.

### Upgrade notes

- Use the matching Laravel API Base v1.0.0 contract snapshot.
- Copy `vite.config.example.ts` to the ignored `vite.config.ts` during setup.
- Configure `VITE_API_BASE_URL` with the backend `/api/v1` URL and add the
  deployed frontend origin to backend `CORS_ALLOWED_ORIGINS`.
- Regenerate committed types whenever the backend contract snapshot changes.

Release publication still requires merging the coordinated release branches,
running final checks on `main`, creating the `v1.0.0` tags, and publishing the
matching GitHub releases.

## v0.9.0 — 2026-09-07

The v0.9.0 release completes frontend feature parity with the backend API,
including account activation, profile and security flows, permission-aware user
and role management, dashboard and audit integrations, and the frontend quality
workflow.

See the backend [docs/SETUP_GUIDE.md](https://github.com/peeyush-budhia/laravel-api-base/blob/main/docs/SETUP_GUIDE.md)
for the complete backend and frontend setup.

## v0.8.0 — 2026-09-03

The v0.8.0 frontend work expanded the project beyond API integration into test
coverage and UX consistency.

### Auth and Profile

- Added account activation for administrator-created users through expiring
  onboarding links and the existing password-reset API contract.
- Account activation now verifies the onboarding email when the user
  successfully chooses their password.
- Completed token lifecycle handling and root redirect stability.
- Confirmed remember-me persistence behavior and invalid-session recovery.
- Completed profile avatar, profile update, and password/security action cleanup.
- Standardized success feedback with toast notifications in profile and password flows.

### Dashboard

- Reviewed dashboard widget states for loading, empty, and error handling.
- Standardized recent activity formatting and dashboard fallback behavior.
- Replaced dashboard metric placeholders with colored SVG icons.

### Users

- Reviewed permission-driven actions across the user list and detail flows.
- Added confirmation dialogs for delete, restore, and permanent delete actions.
- Standardized success notifications after user actions.
- Centralized route guard behavior to redirect denied users to an allowed route.

### Roles & Permissions

- Reviewed permission-driven actions across the role list, detail, create, and edit flows.
- Added confirmation before deleting roles and syncing permissions.
- Standardized success notifications after role actions.
- Validated permission loading, empty, and error states for role permission management.

### Audit Logs

- Reviewed audit log list and detail display consistency.
- Standardized audit log user and date formatting across list, dashboard, and detail views.
- Improved pagination, filter, and empty-state handling for audit log screens.
- Centralized permission-based access behavior for audit logs.

### Testing

- Kept dashboard and sidebar tests isolated from SVG icon implementations.
- Added a Vitest test setup with jsdom and shared test setup.
- Added API service tests for auth, users, roles, profile, dashboard, and audit logs.
- Added route and authorization tests.
- Added password policy and validation tests.
- Added component and page tests for key auth flows.

### UX and UI States

- Added reusable loading, error, and empty state components.
- Improved dashboard, user, role, audit log, and profile screens to use shared states.
- Improved form validation feedback for password and form-driven screens.
- Reviewed accessibility across major screens and tightened mobile dashboard behavior.

### Data Integration

- Added real dashboard API integration.
- Added audit log API integration.
- Added password policy API handling for password-related forms.

### Cleanup

- Removed the obsolete standalone change-password route and
  `must_change_password` API state; authenticated password changes remain in
  the profile security section.
- Removed unused settings and signup screens from the routed application.

## v0.7.1 — 2026-08-24

The v0.7.1 frontend release aligned the UI with the Laravel API Base
documentation and API integration structure.

### API Integration

- Centralized API endpoint definitions.
- Added structured API response typing.
- Added normalized API error handling.
- Added profile API integration.
- Added user API operations for restore and force delete.
- Added role API operations for permissions.
- Added role permission synchronization payload typing.
- Improved API client handling for authenticated requests and FormData uploads.

### Authentication

- Centralized authentication service.
- Added login, logout, current-user, password reset, and password change API flows.
- Added permission-aware authorization helpers.
- Added protected route behavior for users who must change their password.

### Documentation

- Added frontend API integration documentation.
- Linked frontend documentation to the Laravel API Base backend repository.
- Documented the backend repository as the source of truth for API contracts.
