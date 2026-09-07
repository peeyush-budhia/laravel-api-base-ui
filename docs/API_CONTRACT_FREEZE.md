# v1.0.0 API Contract Freeze

The frontend consumes the Laravel API Base v1.0.0 contract. The backend
repository is authoritative for endpoint behavior and generated OpenAPI
schemas; this document records the frontend compatibility boundary.

## Version and transport

- Base path: `/api/v1`
- Local backend URL: `http://localhost:8000`
- Local frontend URL: `http://localhost:5173`
- JSON requests use `Content-Type: application/json`.
- Authenticated requests send `Authorization: Bearer <token>`.

All responses use `success`, `status`, `message`, `data`, `errors`, and `meta`.
The frontend normalizes failures into `{ status, message, errors }` and must not
depend on Axios-specific error objects in components.

## Frozen endpoint surface

The frontend integration is frozen against these paths:

```text
/health
/auth/login                 /auth/logout                 /auth/me
/auth/forgot-password       /auth/reset-password         /auth/change-password
/auth/password-policy
/dashboard
/audit-logs                 /audit-logs/{id}
/profile                    /profile/avatar
/users                      /users/{id}                   /users/{id}/restore
/users/{id}/force
/roles                      /roles/{id}                    /roles/permissions
/roles/{id}/permissions
```

Routes, methods, required fields, response types, permissions, and pagination
keys are treated as stable for v1.0.0. The backend may add optional fields or
new endpoints only when existing frontend behavior remains valid.

## Authentication and activation

The token is stored by `src/auth/token.ts` and injected by the shared Axios
client. A `401` clears the token; transient non-authentication failures do not.
Account activation uses the emailed token on `/auth/reset-password`; the
frontend must submit email, token, password, and password confirmation. A
successful activation verifies the email on the backend.

## Change protocol

When the backend contract changes:

1. Update the backend `docs/API.md` and generated OpenAPI documentation.
2. Update `src/api/endpoints.ts`, service methods, and TypeScript types.
3. Update this document and the frontend `docs/API.md`.
4. Add or update behavior tests in both repositories.
5. Run frontend lint, tests, and build plus the backend test, lint, analysis,
   and OpenAPI checks.

Breaking changes require a new API version or an explicit release decision.
