# Release Notes

## v0.8.0

Current work on the frontend expands the project beyond API integration into test coverage and UX consistency.

### Testing

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

- Removed unused settings and signup screens from the routed application.

## v0.7.0

The `v0.7.0` frontend work aligns the UI with the Laravel API Base documentation and API integration structure.

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
