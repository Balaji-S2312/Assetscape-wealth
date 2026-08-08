# Verification checklist

After `docker compose up --build`:

1. Open `http://localhost:3000/register`.
2. Register using a password containing uppercase, lowercase, and a number.
3. Confirm the dashboard loads starter records.
4. Add one asset, liability, and transaction.
5. Log out.
6. Log in again with the same email and password.
7. Confirm all three records return from PostgreSQL.
8. Restart containers using `docker compose down` and `docker compose up`.
9. Confirm the records still exist.
10. Check `http://localhost:8080/actuator/health` returns `UP`.

Use `docker compose down -v` only when you intentionally want to erase the local PostgreSQL volume.
