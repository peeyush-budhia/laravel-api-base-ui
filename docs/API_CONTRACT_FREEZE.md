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

The backend supplies display metadata for enum-backed values: user
status_label, audit event_label, and permission description. The frontend
renders those fields and generates machine-value types from the committed
OpenAPI snapshot. It keeps only the visual mapping from semantic backend tones
to local component colors.

Tone values are semantic (success, warning, danger, or info); each frontend
maps them to its own visual design system.

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
client. Remembered sessions use `localStorage`; active non-remembered sessions
are exchanged between same-origin tabs and remain in each tab's
`sessionStorage`. A `401` clears the token; transient non-authentication failures do not.
Account activation uses the emailed token on `/auth/reset-password`; the
frontend must submit email, token, password, and password confirmation. A
successful activation verifies the email on the backend.

## Change protocol

When the backend contract changes:

1. Update the backend `docs/API.md` and run `composer contract:export`.
2. Copy backend `docs/openapi.json` to frontend `openapi/openapi.json` and run
   `npm run api:generate`.
3. Update `src/api/endpoints.ts`, service methods, and handwritten response
   types where needed.
4. Update this document and the frontend `docs/API.md`.
5. Add or update behavior tests in both repositories.
6. Run frontend contract, lint, test, and build checks plus the backend test,
   lint, analysis, and OpenAPI checks.

Breaking changes require a new API version or an explicit release decision.
