# Release Notes

## v0.8.0

Current work on the frontend expands the project beyond API integration into test coverage and UX consistency.

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
