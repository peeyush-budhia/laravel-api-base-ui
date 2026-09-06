# Roadmap

## Current

### v0.8.0 — Frontend Quality & UX

- [x] Add a frontend automated test setup
- [x] Add API service tests
- [x] Add authentication flow tests
- [x] Add permission/authorization tests
- [x] Add user management tests
- [x] Add role and permission management tests
- [x] Improve loading and error states
- [x] Improve empty states
- [x] Improve form validation feedback
- [x] Review accessibility across major screens
- [x] Remove unused settings and signup screens

## Recently Released

### v0.7.x — API Documentation & Integration

- [x] Centralized API endpoint definitions
- [x] Shared API response types
- [x] Shared API error normalization
- [x] Authentication API integration
- [x] Profile API integration
- [x] User API integration
- [x] Role and permission API integration
- [x] Frontend API documentation
- [x] Link frontend documentation to backend API documentation
- [x] Link frontend project to backend repository

## Next

### v0.9.x — Frontend Feature Completeness

- 1. Auth
  - [x] Finalize token lifecycle handling
  - [x] Confirm `remember_me` persistence behavior
  - [x] Handle token expiry and invalid-session recovery
  - [x] Keep guest and authenticated root redirects stable

- 2. Profile
  - [x] Complete remaining profile functionality
  - [x] Verify avatar upload and profile image handling
  - [x] Add consistent success and error feedback
  - [x] Review password and security-related profile actions

- 3. Dashboard
  - [x] Improve dashboard integration with real backend data
  - [x] Review dashboard widgets for loading, empty, and error states
  - [x] Keep recent activity formatting consistent
  - [x] Verify dashboard permission and fallback behavior

- 4. Users
  - [x] Review permission-driven actions in user list, details, edit, and create flows
  - [x] Add confirmation for delete, restore, and force-delete actions
  - [x] Standardize notifications after user actions
  - [x] Check route guards and unauthorized states

- 5. Roles & Permissions
  - [x] Review permission-driven actions in role list, details, edit, and create flows
  - [x] Add confirmation for role delete and permission sync actions
  - [x] Standardize notifications after role actions
  - [x] Validate empty and error states for permission data

- 6. Audit Logs
  - [x] Verify list and detail display consistency
  - [x] Keep date and user formatting consistent
  - [x] Ensure pagination, filters, and empty states are handled cleanly
  - [x] Confirm permission-based access behavior

### v1.0.0 — Production Baseline

- [ ] Stable API/backend compatibility
- [ ] Comprehensive automated test coverage
- [ ] Production error handling
- [ ] Production environment configuration
- [ ] Accessibility review
- [ ] Performance review
- [ ] Documentation review
- [ ] Release/versioning policy finalized
