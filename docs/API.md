# Assetscape API

Base URL locally: `http://localhost:8080/api`

All protected endpoints require:

```http
Authorization: Bearer <access-token>
```

The refresh token is a rotating HTTP-only cookie. The browser must send requests with credentials enabled.

## Authentication

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/auth/register` | Create user, seed optional starter data, return access token |
| POST | `/auth/login` | Authenticate and return access token |
| POST | `/auth/refresh` | Rotate refresh token and issue a new access token |
| POST | `/auth/logout` | Revoke refresh token and clear cookie |
| GET | `/auth/me` | Retrieve the logged-in profile |
| POST | `/auth/forgot-password` | Create a 30-minute reset token |
| POST | `/auth/reset-password` | Replace password using reset token |

Registration body:

```json
{
  "fullName": "Balaji S",
  "email": "balaji@example.com",
  "password": "Secure123"
}
```

## Profile

| Method | Endpoint |
|---|---|
| GET | `/users/me` |
| PUT | `/users/me` |
| PUT | `/users/me/password` |

## Assets

`GET /assets`, `GET /assets/{id}`, `POST /assets`, `PUT /assets/{id}`, `DELETE /assets/{id}`

```json
{
  "name": "Emergency fund",
  "category": "Cash",
  "purchaseValue": 50000,
  "currentValue": 52000,
  "purchaseDate": "2026-01-01",
  "ownership": 100,
  "status": "Active",
  "description": "Liquid reserve",
  "image": ""
}
```

## Liabilities

`GET /liabilities`, `GET /liabilities/{id}`, `POST /liabilities`, `PUT /liabilities/{id}`, `DELETE /liabilities/{id}`

## Transactions

`GET /transactions`, `GET /transactions/{id}`, `POST /transactions`, `PUT /transactions/{id}`, `DELETE /transactions/{id}`

Amounts are positive for income/asset sales and negative for expenses, investments, purchases, and liability payments.

## Dashboard

`GET /dashboard/summary`

## Operations

- Public API check: `GET /api/health`
- Railway health check: `GET /actuator/health`
- Prometheus metrics: `GET /actuator/prometheus`
