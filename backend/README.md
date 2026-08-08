# Assetscape Backend

Clean Spring Boot API for persistent personal wealth data.

## Modules

- JWT access tokens and rotating refresh-token cookie
- Registration, login, logout, session refresh and current-user API
- Password reset token flow and password change
- User-isolated asset, liability and transaction CRUD
- PostgreSQL + Flyway migrations
- Dashboard summary calculations
- Validation, consistent API errors, CORS and BCrypt
- Actuator health and Prometheus metrics
- Docker and Railway configuration

## Local database

From the repository root:

```bash
docker compose up postgres -d
cd backend
mvn spring-boot:run
```

API: `http://localhost:8080/api`
Health: `http://localhost:8080/actuator/health`

See `../docs/API.md` and `../docs/RAILWAY_DEPLOYMENT.md`.
