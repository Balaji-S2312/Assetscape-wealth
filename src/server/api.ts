import { dbGetAssets, dbGetLiabilities, dbGetTransactions, dbGetUser, query } from "../lib/db";

export async function handleApiRequest(request: Request): Promise<Response | null> {
  const url = new URL(request.url);
  const pathname = url.pathname;

  if (!pathname.startsWith("/api/")) {
    return null; // Not an API request, let SSR handler take care of it
  }

  const jsonHeaders = {
    "content-type": "application/json",
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
    "access-control-allow-headers": "Content-Type, Authorization",
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: jsonHeaders });
  }

  try {
    // Health check
    if (pathname === "/api/health") {
      const dbCheck = await query("SELECT NOW() as now");
      return new Response(
        JSON.stringify({ status: "healthy", database: "connected", time: dbCheck.rows[0].now }),
        { status: 200, headers: jsonHeaders },
      );
    }

    // --- ASSETS ---
    if (pathname === "/api/assets") {
      if (request.method === "GET") {
        const assets = await dbGetAssets();
        return new Response(JSON.stringify(assets), { status: 200, headers: jsonHeaders });
      }

      if (request.method === "POST") {
        const body = await request.json();
        const id = body.id || `AST-${Date.now()}`;
        const userId = body.userId || "USR-1";
        await query(
          `INSERT INTO assets (id, user_id, name, category, purchase_value, current_value, purchase_date, ownership, status, description, image, history)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
          [
            id,
            userId,
            body.name,
            body.category,
            body.purchaseValue || 0,
            body.currentValue || 0,
            body.purchaseDate || "",
            body.ownership || 100,
            body.status || "Active",
            body.description || "",
            body.image || "",
            JSON.stringify(body.history || []),
          ],
        );
        return new Response(JSON.stringify({ ...body, id }), { status: 201, headers: jsonHeaders });
      }
    }

    if (pathname.startsWith("/api/assets/")) {
      const id = pathname.replace("/api/assets/", "");
      if (request.method === "PUT") {
        const body = await request.json();
        await query(
          `UPDATE assets
           SET name = COALESCE($1, name),
               category = COALESCE($2, category),
               purchase_value = COALESCE($3, purchase_value),
               current_value = COALESCE($4, current_value),
               ownership = COALESCE($5, ownership),
               status = COALESCE($6, status),
               description = COALESCE($7, description)
           WHERE id = $8`,
          [
            body.name,
            body.category,
            body.purchaseValue,
            body.currentValue,
            body.ownership,
            body.status,
            body.description,
            id,
          ],
        );
        return new Response(JSON.stringify({ id, ...body }), { status: 200, headers: jsonHeaders });
      }

      if (request.method === "DELETE") {
        await query("DELETE FROM assets WHERE id = $1", [id]);
        return new Response(JSON.stringify({ success: true, id }), {
          status: 200,
          headers: jsonHeaders,
        });
      }
    }

    // --- LIABILITIES ---
    if (pathname === "/api/liabilities") {
      if (request.method === "GET") {
        const liabilities = await dbGetLiabilities();
        return new Response(JSON.stringify(liabilities), { status: 200, headers: jsonHeaders });
      }

      if (request.method === "POST") {
        const body = await request.json();
        const id = body.id || `LIA-${Date.now()}`;
        const userId = body.userId || "USR-1";
        await query(
          `INSERT INTO liabilities (id, user_id, name, category, original_amount, outstanding, interest_rate, monthly_payment, start_date, due_date, status, description)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
          [
            id,
            userId,
            body.name,
            body.category,
            body.originalAmount || 0,
            body.outstanding || 0,
            body.interestRate || 0,
            body.monthlyPayment || 0,
            body.startDate || "",
            body.dueDate || "",
            body.status || "Active",
            body.description || "",
          ],
        );
        return new Response(JSON.stringify({ ...body, id }), { status: 201, headers: jsonHeaders });
      }
    }

    if (pathname.startsWith("/api/liabilities/")) {
      const id = pathname.replace("/api/liabilities/", "");
      if (request.method === "PUT") {
        const body = await request.json();
        await query(
          `UPDATE liabilities
           SET name = COALESCE($1, name),
               category = COALESCE($2, category),
               original_amount = COALESCE($3, original_amount),
               outstanding = COALESCE($4, outstanding),
               interest_rate = COALESCE($5, interest_rate),
               monthly_payment = COALESCE($6, monthly_payment),
               status = COALESCE($7, status),
               description = COALESCE($8, description)
           WHERE id = $9`,
          [
            body.name,
            body.category,
            body.originalAmount,
            body.outstanding,
            body.interestRate,
            body.monthlyPayment,
            body.status,
            body.description,
            id,
          ],
        );
        return new Response(JSON.stringify({ id, ...body }), { status: 200, headers: jsonHeaders });
      }

      if (request.method === "DELETE") {
        await query("DELETE FROM liabilities WHERE id = $1", [id]);
        return new Response(JSON.stringify({ success: true, id }), {
          status: 200,
          headers: jsonHeaders,
        });
      }
    }

    // --- TRANSACTIONS ---
    if (pathname === "/api/transactions") {
      if (request.method === "GET") {
        const transactions = await dbGetTransactions();
        return new Response(JSON.stringify(transactions), { status: 200, headers: jsonHeaders });
      }

      if (request.method === "POST") {
        const body = await request.json();
        const id = body.id || `TRX-${Date.now()}`;
        const userId = body.userId || "USR-1";
        await query(
          `INSERT INTO transactions (id, user_id, date, title, type, category, amount, account, note)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [
            id,
            userId,
            body.date || new Date().toISOString().slice(0, 10),
            body.title,
            body.type || "Expense",
            body.category || "Other",
            body.amount || 0,
            body.account || "",
            body.note || "",
          ],
        );
        return new Response(JSON.stringify({ ...body, id }), { status: 201, headers: jsonHeaders });
      }
    }

    if (pathname.startsWith("/api/transactions/")) {
      const id = pathname.replace("/api/transactions/", "");
      if (request.method === "DELETE") {
        await query("DELETE FROM transactions WHERE id = $1", [id]);
        return new Response(JSON.stringify({ success: true, id }), {
          status: 200,
          headers: jsonHeaders,
        });
      }
    }

    // --- USER PROFILE ---
    if (pathname === "/api/user") {
      const user = await dbGetUser();
      return new Response(JSON.stringify(user), { status: 200, headers: jsonHeaders });
    }

    return new Response(JSON.stringify({ error: "API endpoint not found" }), {
      status: 404,
      headers: jsonHeaders,
    });
  } catch (error) {
    console.error("API error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }),
      { status: 500, headers: jsonHeaders },
    );
  }
}
