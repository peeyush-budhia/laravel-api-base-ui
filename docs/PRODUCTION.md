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
npm run format:check
npm run lint
npm run api:check
npm test
npm run build
```

Publish `dist/` to the static host. Configure the host to serve `index.html`
for unknown application routes so direct navigation to `/activate-account`,
`/profile`, or another client route is handled by React. Enable HTTPS and set
long-lived immutable caching for hashed assets while keeping `index.html`
short-lived.

## Production Docker image

The production Dockerfile builds the application with Node and copies only the
generated `dist/` output into Nginx. The runtime image contains no Node.js,
source tree, or development dependencies. Nginx provides SPA fallback,
immutable caching for hashed assets, security headers, and `/healthz` for
container readiness.

Create the build environment and set the public API URL:

```bash
cp .env.production.example .env.production
docker compose --env-file .env.production -f docker-compose.production.yml build
docker compose --env-file .env.production -f docker-compose.production.yml up -d
```

The container is published on `FRONTEND_PORT` (8081 by default). Terminate TLS
at the reverse proxy or load balancer and forward requests to that port. Since
Vite embeds `VITE_API_BASE_URL` during the image build, rebuild the image when
the API origin changes. Never put credentials in a `VITE_*` value.

For an image-based deployment, publish `FRONTEND_IMAGE` to the registry and
update the service with:

```bash
docker compose --env-file .env.production -f docker-compose.production.yml pull
docker compose --env-file .env.production -f docker-compose.production.yml up -d --remove-orphans
```

Verify `/healthz` and a client-side route such as `/profile` before switching
traffic. Preserve the previous immutable image tag for rollback.

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
