import pg from "pg";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://assetscape_user:AJBhkiSYnxXHdgAoYoHoNWSnBF1eiVWw@dpg-dbk3kmnlk1mc73aojblg-a.oregon-postgres.render.com/assetscape_wealth?sslmode=require";

let pool: pg.Pool | null = null;

export function getPool(): pg.Pool {
  if (!pool) {
    const isProduction =
      process.env.NODE_ENV === "production" || connectionString.includes("render.com");
    pool = new pg.Pool({
      connectionString,
      ssl: isProduction ? { rejectUnauthorized: false } : false,
      max: 10,
      idleTimeoutMillis: 30000,
    });
  }
  return pool;
}

export async function query<T extends pg.QueryResultRow = pg.QueryResultRow>(
  text: string,
  params?: unknown[],
): Promise<pg.QueryResult<T>> {
  const p = getPool();
  return p.query<T>(text, params);
}

// Data mapping helpers from PostgreSQL snake_case to frontend camelCase
export interface AssetRecord {
  id: string;
  userId?: string;
  name: string;
  category: string;
  purchaseValue: number;
  currentValue: number;
  purchaseDate: string;
  ownership: number;
  status: string;
  description: string;
  image: string;
  history: Array<{ label: string; value: number }>;
}

export interface LiabilityRecord {
  id: string;
  userId?: string;
  name: string;
  category: string;
  originalAmount: number;
  outstanding: number;
  interestRate: number;
  monthlyPayment: number;
  startDate: string;
  dueDate: string;
  status: string;
  description: string;
}

export interface TransactionRecord {
  id: string;
  userId?: string;
  date: string;
  title: string;
  type: string;
  category: string;
  amount: number;
  account: string;
  note: string;
}

interface RawAssetRow extends pg.QueryResultRow {
  id: string;
  user_id: string;
  name: string;
  category: string;
  purchase_value: string | number;
  current_value: string | number;
  purchase_date: string;
  ownership: string | number;
  status: string;
  description: string;
  image: string;
  history: unknown;
}

interface RawLiabilityRow extends pg.QueryResultRow {
  id: string;
  user_id: string;
  name: string;
  category: string;
  original_amount: string | number;
  outstanding: string | number;
  interest_rate: string | number;
  monthly_payment: string | number;
  start_date: string;
  due_date: string;
  status: string;
  description: string;
}

interface RawTransactionRow extends pg.QueryResultRow {
  id: string;
  user_id: string;
  date: string;
  title: string;
  type: string;
  category: string;
  amount: string | number;
  account: string;
  note: string;
}

interface RawUserRow extends pg.QueryResultRow {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  occupation: string;
  currency: string;
  country: string;
  bio: string;
  avatar: string;
  member_since: string;
}

export async function dbGetAssets(userId = "USR-1"): Promise<AssetRecord[]> {
  const res = await query<RawAssetRow>(
    `SELECT id, user_id, name, category, purchase_value, current_value, purchase_date,
            ownership, status, description, image, history
     FROM assets
     WHERE user_id = $1
     ORDER BY current_value DESC`,
    [userId],
  );

  return res.rows.map((r) => ({
    id: r.id,
    userId: r.user_id,
    name: r.name,
    category: r.category,
    purchaseValue: Number(r.purchase_value),
    currentValue: Number(r.current_value),
    purchaseDate: r.purchase_date,
    ownership: Number(r.ownership),
    status: r.status,
    description: r.description,
    image: r.image,
    history: Array.isArray(r.history) ? (r.history as Array<{ label: string; value: number }>) : [],
  }));
}

export async function dbGetLiabilities(userId = "USR-1"): Promise<LiabilityRecord[]> {
  const res = await query<RawLiabilityRow>(
    `SELECT id, user_id, name, category, original_amount, outstanding,
            interest_rate, monthly_payment, start_date, due_date, status, description
     FROM liabilities
     WHERE user_id = $1
     ORDER BY outstanding DESC`,
    [userId],
  );

  return res.rows.map((r) => ({
    id: r.id,
    userId: r.user_id,
    name: r.name,
    category: r.category,
    originalAmount: Number(r.original_amount),
    outstanding: Number(r.outstanding),
    interestRate: Number(r.interest_rate),
    monthlyPayment: Number(r.monthly_payment),
    startDate: r.start_date,
    dueDate: r.due_date,
    status: r.status,
    description: r.description,
  }));
}

export async function dbGetTransactions(userId = "USR-1"): Promise<TransactionRecord[]> {
  const res = await query<RawTransactionRow>(
    `SELECT id, user_id, date, title, type, category, amount, account, note
     FROM transactions
     WHERE user_id = $1
     ORDER BY date DESC, created_at DESC`,
    [userId],
  );

  return res.rows.map((r) => ({
    id: r.id,
    userId: r.user_id,
    date: r.date,
    title: r.title,
    type: r.type,
    category: r.category,
    amount: Number(r.amount),
    account: r.account,
    note: r.note,
  }));
}

export async function dbGetUser(userId = "USR-1") {
  const res = await query<RawUserRow>(
    `SELECT id, full_name, email, phone, occupation, currency, country, bio, avatar, member_since
     FROM users
     WHERE id = $1`,
    [userId],
  );
  if (res.rows.length === 0) return null;
  const r = res.rows[0];
  return {
    id: r.id,
    fullName: r.full_name,
    email: r.email,
    phone: r.phone,
    occupation: r.occupation,
    currency: r.currency,
    country: r.country,
    bio: r.bio,
    avatar: r.avatar,
    memberSince: r.member_since,
  };
}
