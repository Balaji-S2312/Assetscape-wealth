# Local setup

## Fastest path: Docker

Install Docker Desktop, then run from the repository root:

```powershell
docker compose up --build
```

Open:

- Frontend: `http://localhost:3000`
- Backend health: `http://localhost:8080/actuator/health`
- PostgreSQL: `localhost:5432`

Stop:

```powershell
docker compose down
```

Delete the local database volume only when you intentionally want to erase all saved accounts and records:

```powershell
docker compose down -v
```

## Run without Docker

1. Start PostgreSQL and create database/user `assetscape` with password `assetscape`.
2. Backend:

```powershell
cd backend
mvn spring-boot:run
```

3. Frontend in another terminal:

```powershell
npm install
$env:VITE_API_URL="http://localhost:8080/api"
npm run dev
```
