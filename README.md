# Assetscape Wealth

A full-stack personal wealth-management platform with persistent user accounts, assets, liabilities, transactions, analytics, and reports.

## Architecture

```text
React + TanStack Start frontend
             ↓ HTTPS / REST
Spring Boot 3 + Spring Security + JWT
             ↓ JPA / Flyway
PostgreSQL
```

## Implemented

### Authentication

- Registration and BCrypt password hashing
- Login with short-lived JWT access token
- Rotating refresh token stored as an HTTP-only cookie
- Automatic frontend token refresh
- Logout and refresh-token revocation
- Current-user profile restoration
- Password change
- Forgot/reset-password token flow
- User-level data isolation

### Financial data

- Asset CRUD
- Liability CRUD
- Transaction CRUD
- PostgreSQL persistence
- Dashboard calculations
- Analytics and CSV/JSON exports
- Starter data for newly registered demo accounts

### DevOps

- Frontend and backend Dockerfiles
- Docker Compose for frontend, backend, and PostgreSQL
- Optional Prometheus and Grafana profile
- GitHub Actions build/test/container pipeline
- Trivy security scan
- Manual Railway deployment workflow
- Railway service configuration and health checks

## Local run with Docker

```powershell
docker compose up --build
```

Open:

- App: `http://localhost:3000`
- API health: `http://localhost:8080/actuator/health`

Data remains after logout and container restart because PostgreSQL uses a Docker volume.

Stop without deleting data:

```powershell
docker compose down
```

Delete all local accounts and records:

```powershell
docker compose down -v
```

## Local run without Docker

See [`docs/LOCAL_SETUP.md`](docs/LOCAL_SETUP.md).

## Railway

See [`docs/RAILWAY_DEPLOYMENT.md`](docs/RAILWAY_DEPLOYMENT.md).

## API

See [`docs/API.md`](docs/API.md).

## Required Railway services

- PostgreSQL
- Backend service rooted at `/backend`
- Frontend service rooted at `/`

No AI model or external API key is required for the implemented application.
