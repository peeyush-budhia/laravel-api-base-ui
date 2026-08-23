# Laravel API Base UI

React + Vite frontend for the **Laravel API Base** backend.

This project provides the web UI for authentication, user management, role management, permissions, profile management, and dashboard functionality.

## Related Project

Backend repository:

- [Laravel API Base](https://github.com/peeyush-budhia/laravel-api-base)

The frontend communicates with the versioned Laravel API provided by the backend project.

## Documentation

### Frontend Documentation

Frontend documentation is maintained in this repository under `docs/`.

- [API Integration](docs/API.md)
- [Development Guide](docs/DEVELOPMENT.md)
- [Testing Guide](docs/TESTING.md)
- [Release Notes](docs/RELEASE.md)
- [Roadmap](docs/ROADMAP.md)

### Backend API Documentation

The backend project contains the authoritative API documentation and API standards.

- [Backend Repository](https://github.com/peeyush-budhia/laravel-api-base)
- [Backend API Documentation](https://github.com/peeyush-budhia/laravel-api-base/tree/main/docs)
- [Backend API Standards](https://github.com/peeyush-budhia/laravel-api-base/blob/main/docs/API_STANDARDS.md)

> The backend API documentation is the source of truth for API endpoints, request/response contracts, authentication, validation, and API behavior. Frontend documentation describes how this UI consumes those APIs.

## Features

- Authentication and logout
- Forgot/reset/change password flows
- Protected application routes
- Permission-aware UI
- User management
- Role management
- Role permission management
- User profile management
- Avatar upload
- Pagination, filtering, searching, and sorting
- Centralized Axios API client
- Centralized API endpoint definitions
- TypeScript API contracts
- Responsive dashboard UI

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Axios
- React Router
- ApexCharts

## Requirements

- Node.js
- npm
- Running Laravel API Base backend

## Configuration

Create the local environment file:

```bash
cp .env.example .env
```

Configure the backend API base URL in the frontend environment.

The frontend expects the API base URL to point to the Laravel API Base versioned API.

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Validation

Run linting:

```bash
npm run lint
```

Run the production build:

```bash
npm run build
```

Run formatting checks:

```bash
npm run format:check
```

## API Architecture

The frontend keeps API concerns centralized:

```text
src/
├── api/
│   ├── client.ts
│   ├── endpoints.ts
│   ├── roles.ts
│   ├── users.ts
│   └── profile.ts
├── auth/
│   ├── authService.ts
│   ├── authorization.ts
│   ├── permissions.ts
│   ├── token.ts
│   └── types.ts
└── types/
```

`src/api/endpoints.ts` contains the frontend endpoint map.

`src/api/client.ts` contains the shared Axios client, authentication header handling, FormData handling, and normalized API error handling.

`src/api/profile.ts`, `src/api/users.ts`, and `src/api/roles.ts` contain feature-specific API operations.

## Backend / Frontend Relationship

```text
Laravel API Base
       │
       │ REST API /api/v1
       ▼
laravel-api-base-ui
       │
       ├── Authentication
       ├── Profile
       ├── Users
       ├── Roles
       └── Permissions
```

Keep backend and frontend contracts synchronized when API endpoints, request payloads, response structures, permissions, or validation rules change.

## Versioning

The backend uses API versioning. Frontend releases should identify the backend API version they support.

For the current project release, refer to the backend repository for the authoritative API release and documentation.

## Contributing

Use feature branches and keep changes focused.

Before opening a pull request, run:

```bash
npm run lint
npm run build
npm run format:check
```

Update relevant documentation when changing API integration, routes, permissions, or user-facing behavior.

## License

See the repository for licensing information.
