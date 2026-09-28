# Deploying Assetscape Wealth to Render

This guide explains how to deploy **Assetscape Wealth** to [Render](https://render.com) using your Render PostgreSQL database.

---

## Architecture on Render

```text
Render Frontend (Web Service - Docker)
       ↓ HTTPS / REST
Render Backend (Web Service - Docker)
       ↓ Internal network (Port 5432)
Render PostgreSQL (Managed Database)
```

---

## Step 1: Get Your Render PostgreSQL Details

From your **Render Dashboard** → click your PostgreSQL database:

Under the **Info / Connect** tab, note the following:
- **Internal Database URL** (e.g. `postgres://user:pass@dpg-xxx-a:5432/assetscape`)
- **Internal Host** (e.g. `dpg-xxxxxx-a`)
- **Port**: `5432`
- **Database**: database name
- **User**: username
- **Password**: password

*(If connecting from your local PC, use the **External Host** / **External Database URL** instead).*

---

## Step 2: Deploy the Backend Web Service

1. Go to **Render Dashboard** → **New +** → **Web Service**.
2. Select your repository: `Balaji-S2312/Assetscape-wealth`.
3. Configure the service:
   - **Name**: `assetscape-backend`
   - **Region**: Same region as your Render PostgreSQL database (e.g. Oregon)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: **Docker** (it will automatically detect `backend/Dockerfile`)
   - **Instance Type**: **Free**
4. Set **Health Check Path**:
   - `/actuator/health`
5. Under **Environment Variables**, add:
   | Key | Value | Notes |
   | :--- | :--- | :--- |
   | `PORT` | `8080` | Backend port |
   | `PGHOST` | `<Internal Host from Render Postgres>` | e.g. `dpg-c1234567-a` |
   | `PGPORT` | `5432` | Postgres port |
   | `PGDATABASE` | `<Your Render Database Name>` | |
   | `PGUSER` | `<Your Render Username>` | |
   | `PGPASSWORD` | `<Your Render Password>` | |
   | `JWT_SECRET` | `<Random string of at least 32 characters>` | e.g. `my-very-secure-jwt-key-render-32-chars` |
   | `COOKIE_SECURE` | `true` | Required for HTTPS |
   | `SEED_DEMO_DATA` | `true` | Populates demo data |
   | `EXPOSE_RESET_TOKEN` | `true` | Allows reset token without SMTP |
   | `APP_CORS_ALLOWED_ORIGINS` | `https://assetscape-frontend.onrender.com` | Update with your frontend Render URL |
6. Click **Create Web Service**.
7. Once deployed, test your backend health at:
   `https://assetscape-backend.onrender.com/actuator/health` (should return `{"status":"UP"}`).

---

## Step 3: Deploy the Frontend Web Service

1. Go to **Render Dashboard** → **New +** → **Web Service**.
2. Select the same repository: `Balaji-S2312/Assetscape-wealth`.
3. Configure:
   - **Name**: `assetscape-frontend`
   - **Region**: Same region as backend
   - **Branch**: `main`
   - **Root Directory**: Leave blank (root `/`)
   - **Runtime**: **Docker** (detects root `Dockerfile`)
   - **Instance Type**: **Free**
4. Under **Environment Variables**, add:
   | Key | Value | Notes |
   | :--- | :--- | :--- |
   | `PORT` | `3000` | Frontend port |
   | `VITE_API_URL` | `https://assetscape-backend.onrender.com/api` | Your backend Render URL + `/api` |
5. Click **Create Web Service**.
6. When the frontend finishes deploying, note its public Render URL (e.g. `https://assetscape-frontend.onrender.com`).

---

## Step 4: Final Link Check

1. Go back to your `assetscape-backend` service settings on Render.
2. Ensure `APP_CORS_ALLOWED_ORIGINS` matches your frontend domain:
   `https://assetscape-frontend.onrender.com`
3. If you changed it, Render will automatically redeploy the backend.
4. Visit your frontend URL in your browser:
   - Register a new account.
   - Flyway migrations will run automatically on your Render PostgreSQL database!
