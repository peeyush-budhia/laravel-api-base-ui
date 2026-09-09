# Frontend Security and Error Handling

The frontend is a public static bundle and must not contain secrets. Only
VITE_* configuration intended for browsers may be embedded at build time.

## Deployment controls

- Serve the bundle over HTTPS and configure a restrictive Content-Security
  Policy at the hosting layer.
- Set VITE_API_BASE_URL to the HTTPS /api/v1 origin and configure that exact
  frontend origin in the backend CORS_ALLOWED_ORIGINS.
- Keep source maps private when the deployment policy does not permit them.
- Configure SPA fallback to index.html without exposing repository files.
- Treat localStorage tokens as XSS-sensitive; keep dependencies patched and
  avoid rendering unsanitized HTML.
- The production Nginx image adds content-type, frame, and referrer headers,
  exposes only the generated `dist/` bundle, and contains no Node runtime or
  repository source.
- Keep `.env.production` outside Git. Only public `VITE_*` build values belong
  in the image; credentials must remain in backend or hosting secrets.

Remembered sessions use `localStorage`. Non-remembered sessions use
`sessionStorage` and are shared transiently with other currently open
same-origin tabs through `BroadcastChannel`; receiving tabs retain their copy
only in `sessionStorage`. Closing every tab therefore still ends browser-side
access to a non-remembered session. Login, logout, and unauthorized-session
events are synchronized between tabs using the same channel.

## Error handling

The Axios client converts backend failures into status, message, and errors.
Components should use getApiErrorMessage and getApiFieldErrors; they must not
display raw Axios errors, response bodies, or stack traces. A 401 clears
stored tokens and other failures preserve the session so transient network
errors do not force a logout.

Production builds must show a safe generic fallback for unavailable services
and record diagnostic details only in protected client telemetry, if enabled.
