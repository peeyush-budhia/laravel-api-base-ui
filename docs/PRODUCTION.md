# Frontend Production Deployment

The frontend is a static Vite application. Build it in CI and serve the
generated `dist/` directory from a TLS enabled static host or web server.

## Build configuration

Create `.env.production` in the deployment environment (never commit it):

```dotenv
VITE_APP_NAME="Laravel API Base"
VITE_APP_ENV=production
VITE_API_BASE_URL="https://api.example.com/api/v1"
```

`VITE_API_BASE_URL` must include the backend `/api/v1` prefix and must use the
same public API origin configured in the backend's `CORS_ALLOWED_ORIGINS`.
Vite embeds `VITE_*` values into the bundle, so do not put secrets in them.

## Build and serve

```bash
npm ci
npm run lint
npm test -- --run
npm run build
```

Publish `dist/` to the static host. Configure the host to serve `index.html`
for unknown application routes so direct navigation to `/activate-account`,
`/profile`, or another client route is handled by React. Enable HTTPS and set
long-lived immutable caching for hashed assets while keeping `index.html`
short-lived.

## Backend coordination

Before switching traffic, verify that the backend has:

- `APP_ENV=production` and `APP_DEBUG=false`;
- `CORS_ALLOWED_ORIGINS` set to the exact frontend origin;
- a valid TLS URL in `FRONTEND_URL` for account activation links;
- a healthy `/up` and `/api/v1/health` response; and
- queue workers running for onboarding and mail notifications.

Test login, logout, account activation, profile updates, avatar uploads, and a
permission-protected page from the deployed origin. Browser CORS failures are
usually caused by an origin mismatch, a missing `/api/v1` base path, or an API
that is not serving HTTPS.
