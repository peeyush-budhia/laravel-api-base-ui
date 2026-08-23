# Release Notes

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
