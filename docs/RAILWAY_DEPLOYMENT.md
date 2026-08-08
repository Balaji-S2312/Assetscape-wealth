# Railway deployment

Create **three Railway services in one project**:

1. PostgreSQL plugin
2. `assetscape-backend`
3. `assetscape-frontend`

## Backend service

Connect the GitHub repository and set the service root directory to:

```text
/backend
```

Railway will use `backend/Dockerfile` and `backend/railway.json`.

Add PostgreSQL variable references to the backend:

```text
PGHOST=${{Postgres.PGHOST}}
PGPORT=${{Postgres.PGPORT}}
PGDATABASE=${{Postgres.PGDATABASE}}
PGUSER=${{Postgres.PGUSER}}
PGPASSWORD=${{Postgres.PGPASSWORD}}
```

Add:

```text
JWT_SECRET=<generate a random secret of at least 32 characters>
COOKIE_SECURE=true
SEED_DEMO_DATA=true
EXPOSE_RESET_TOKEN=true
APP_CORS_ALLOWED_ORIGINS=https://<frontend-domain>.up.railway.app
```

Generate a public domain for the backend. Verify:

```text
https://<backend-domain>.up.railway.app/actuator/health
```

`EXPOSE_RESET_TOKEN=true` is only for a portfolio demo without an email provider. Set it to `false` when SMTP email delivery is implemented.

## Frontend service

Connect the same repository and leave its root directory as `/`.

Add the build-time variable:

```text
VITE_API_URL=https://<backend-domain>.up.railway.app/api
```

Generate the frontend public domain. Then update the backend variable:

```text
APP_CORS_ALLOWED_ORIGINS=https://<frontend-domain>.up.railway.app
```

Redeploy both services after changing domains.

## Persistence verification

1. Register a new account.
2. Add an asset.
3. Log out.
4. Close and reopen the browser.
5. Log in with the same account.
6. The asset must reappear because it is loaded from Railway PostgreSQL.

## Cost control

- Use one PostgreSQL database only.
- Keep backend connection pool at the default `5`.
- Do not add Redis, object storage, or AI APIs until needed.
- Set Railway usage limits and billing alerts.
