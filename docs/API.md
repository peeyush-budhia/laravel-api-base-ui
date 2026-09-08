# Frontend API Integration

This document describes how `laravel-api-base-ui` consumes the Laravel API Base backend.

The v1.0.0 compatibility boundary is recorded in [API_CONTRACT_FREEZE.md](API_CONTRACT_FREEZE.md).

User, audit, and permission display text comes from backend fields
status_label, event_label, and description. The frontend keeps only stable
machine-value types and visual color mappings.

Production hosting and the backend origin required for browser requests are
covered in [PRODUCTION.md](PRODUCTION.md).

## Backend

The backend supplies status_label/status_tone, event_label/event_tone, and
permission description fields. The shared semantic tone adapter maps those
values to this frontend's badge colors.

- [Laravel API Base repository](https://github.com/peeyush-budhia/laravel-api-base)
- [Backend API documentation](https://github.com/peeyush-budhia/laravel-api-base/tree/main/docs)
- [Backend API standards](https://github.com/peeyush-budhia/laravel-api-base/blob/main/docs/API_STANDARDS.md)

The backend documentation is authoritative for API behavior. This document describes the frontend integration layer.

## API Client

The shared Axios client is:

```text
src/api/client.ts
```

It provides:

- Configured API base URL
- JSON request headers
- Bearer token injection
- FormData handling
- Centralized API error normalization
- Automatic token clearing on HTTP 401 responses

## Endpoint Map

The frontend endpoint definitions are centralized in:

```text
src/api/endpoints.ts
```

Current endpoint map:

```text
/health

/auth/login
/auth/logout
/auth/me
/auth/forgot-password
/auth/reset-password
/auth/change-password
/auth/password-policy

/dashboard

/audit-logs
/audit-logs/{id}

/profile
/profile/avatar

/users
/users/{id}
/users/{id}/restore
/users/{id}/force

/roles
/roles/{id}
/roles/permissions
/roles/{id}/permissions
```

## API Modules

### Authentication

```text
src/auth/authService.ts
```

Operations:

- Login
- Logout
- Current authenticated user
- Forgot password
- Reset password
- Change password
- Get password policy

Authenticated password changes are presented in the profile security section.

### Account Activation

Administrators create users without choosing or receiving a temporary
password. The backend queues an onboarding email after the user transaction
commits. Its expiring link opens the public `/activate-account` route with the
user email and reset token in the query string.

The activation page submits the email, token, password, and password
confirmation through the existing `/auth/reset-password` endpoint. A successful
activation sets `email_verified_at` on the backend because the emailed token
proves access to the onboarding address. The user can then sign in with the new
password. Expired or already-used links show the normalized backend error and
direct the user to request help from an administrator.

### Dashboard

```text
src/api/dashboard.ts
```

Operations:

- Get dashboard data

### Audit Logs

```text
src/api/auditLogs.ts
```

Operations:

- List audit logs
- Show audit log

### Profile

```text
src/api/profile.ts
```

Operations:

- Update profile
- Update avatar

### Users

```text
src/api/users.ts
```

Operations:

- List users
- Show user
- Create user
- Update user
- Soft delete user
- Restore user
- Force delete user

### Roles

```text
src/api/roles.ts
```

Operations:

- List roles
- Show role
- List all permissions
- Create role
- Update role
- Delete role
- List role permissions
- Synchronize role permissions

## Response Contract

Successful API responses use the shared `ApiResponse<T>` contract:

```ts
export interface ApiResponse<T = unknown> {
  success: true;
  status: number;
  message: string;
  data: T;
  errors: null;
  meta: Record<string, unknown>;
}
```

Paginated responses extend this contract with pagination metadata.

## Error Contract

The frontend normalizes backend errors to:

```ts
export interface ApiError {
  status: number | null;
  message: string;
  errors: Record<string, string[]> | null;
}
```

Components should consume normalized API errors instead of depending directly on Axios error structures.

## Authentication

The access token is stored through:

```text
src/auth/token.ts
```

The Axios request interceptor reads the token and sends:

```http
Authorization: Bearer <token>
```

A `401 Unauthorized` response clears the stored access token.
Non-auth failures while validating the session do not clear the token, so a temporary backend or network issue does not force a logout.

## Permissions

Frontend permission constants are defined in:

```text
src/auth/permissions.ts
```

Authorization helpers are defined in:

```text
src/auth/authorization.ts
```

The frontend currently uses permissions including:

```text
dashboard.view

audit-logs.view

roles.view
roles.create
roles.update
roles.delete
roles.manage-permissions

users.view
users.create
users.update
users.delete
users.restore
```

Frontend permission checks are for UI/route behavior. Backend authorization remains authoritative.

## Backend Documentation as Source of Truth

When frontend and backend documentation appear inconsistent:

1. Check the backend API implementation.
2. Check the backend generated/API documentation.
3. Check `docs/API_STANDARDS.md`.
4. Update the frontend API integration accordingly.

Do not invent frontend-only API contracts that conflict with the backend.

## Keeping the Two Repositories Linked

The frontend README links to the backend repository and backend documentation.

When a backend release changes an API contract:

1. Export the backend snapshot with `composer contract:export`.
2. Copy backend `docs/openapi.json` to `openapi/openapi.json`.
3. Run `npm run api:generate`; `UserStatus` and `AuditEvent` are generated from
   the backend schemas and must not be edited manually.
4. Update `src/api/endpoints.ts` and the relevant API service if needed.
5. Update handwritten response types and permission constants if needed.
6. Update this document and run `npm run api:check`, lint, tests, and build.
7. Record the compatibility change in the frontend release notes.

## Current Backend

The backend repository is:

https://github.com/peeyush-budhia/laravel-api-base

For the current supported backend release, see the backend repository releases and changelog.
