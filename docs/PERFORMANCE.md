# Performance Review

## Implemented improvements

- Application pages are loaded with React.lazy so the initial bundle contains
  only the shell and the route requested by the user.
- Suspense provides a status-aware loading state while a route chunk loads.
- API listing screens request paginated data rather than loading full
  collections.
- Shared callbacks and memoized derived data are used in high-frequency
  interactive components.
- Production builds use Vite and hashed assets suitable for immutable caching.

## Release budgets

Track the generated bundle and set budgets in CI as traffic grows. Investigate
any sustained regression in initial JavaScript, largest contentful paint,
interaction latency, or API request count. Prefer route-level code splitting
and server-side pagination before adding client-side caching complexity.

The current production build reports a large vendor chunk warning from Vite.
This is a monitoring item for the next performance iteration; route splitting
already keeps that code out of the initial page routes where possible.

## Verification

Run npm run build and inspect the generated dist/assets sizes. Test the
dashboard, listing pages, and activation flow on a throttled mobile connection
and confirm loading, retry, and empty states remain responsive.
