import pg from "pg";
import dotenv from "dotenv";
import { mockUser } from "../src/data/user.js";
import { mockAssets } from "../src/data/assets.js";
import { mockLiabilities } from "../src/data/liabilities.js";
import { mockTransactions } from "../src/data/transactions.js";

dotenv.config();

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://assetscape_user:AJBhkiSYnxXHdgAoYoHoNWSnBF1eiVWw@dpg-dbk3kmnlk1mc73aojblg-a.oregon-postgres.render.com/assetscape_wealth?sslmode=require";

const pool = new pg.Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

async function run() {
  console.log("Connecting to PostgreSQL...");
  const client = await pool.connect();
  try {
    console.log("Dropping old tables if inconsistent & recreating fresh schema...");

    await client.query(`
      DROP TABLE IF EXISTS transactions CASCADE;
      DROP TABLE IF EXISTS liabilities CASCADE;
      DROP TABLE IF EXISTS assets CASCADE;
      DROP TABLE IF EXISTS settings CASCADE;
      DROP TABLE IF EXISTS users CASCADE;

      CREATE TABLE users (
        id VARCHAR(64) PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(50),
        occupation VARCHAR(255),
        currency VARCHAR(10) DEFAULT 'GBP',
        country VARCHAR(100),
        bio TEXT,
        avatar TEXT,
        member_since VARCHAR(50),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE assets (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        purchase_value NUMERIC NOT NULL DEFAULT 0,
        current_value NUMERIC NOT NULL DEFAULT 0,
        purchase_date VARCHAR(50),
        ownership NUMERIC DEFAULT 100,
        status VARCHAR(50) DEFAULT 'Active',
        description TEXT,
        image TEXT,
        history JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE liabilities (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        original_amount NUMERIC NOT NULL DEFAULT 0,
        outstanding NUMERIC NOT NULL DEFAULT 0,
        interest_rate NUMERIC DEFAULT 0,
        monthly_payment NUMERIC DEFAULT 0,
        start_date VARCHAR(50),
        due_date VARCHAR(50),
        status VARCHAR(50) DEFAULT 'Active',
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE transactions (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
        date VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        category VARCHAR(100) NOT NULL,
        amount NUMERIC NOT NULL,
        account VARCHAR(255),
        note TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE settings (
        user_id VARCHAR(64) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        currency VARCHAR(10) DEFAULT 'GBP',
        theme VARCHAR(20) DEFAULT 'dark',
        privacy_mode BOOLEAN DEFAULT FALSE,
        notifications BOOLEAN DEFAULT TRUE,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Schema created successfully.");

    console.log("Seeding user...");
    await client.query(
      `INSERT INTO users (id, full_name, email, phone, occupation, currency, country, bio, avatar, member_since)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        mockUser.id,
        mockUser.fullName,
        mockUser.email,
        mockUser.phone || "",
        mockUser.occupation || "",
        mockUser.currency || "GBP",
        mockUser.country || "United Kingdom",
        mockUser.bio || "",
        mockUser.avatar || "",
        mockUser.memberSince || "2024-01-01",
      ],
    );

    await client.query(
      `INSERT INTO settings (user_id, currency, theme, privacy_mode, notifications)
       VALUES ($1, $2, $3, $4, $5)`,
      [mockUser.id, "GBP", "dark", false, true],
    );

    console.log(`Seeding ${mockAssets.length} assets...`);
    for (const asset of mockAssets) {
      await client.query(
        `INSERT INTO assets (id, user_id, name, category, purchase_value, current_value, purchase_date, ownership, status, description, image, history)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [
          asset.id,
          mockUser.id,
          asset.name,
          asset.category,
          asset.purchaseValue || 0,
          asset.currentValue || 0,
          asset.purchaseDate || "",
          asset.ownership || 100,
          asset.status || "Active",
          asset.description || "",
          asset.image || "",
          JSON.stringify(asset.history || []),
        ],
      );
    }

    console.log(`Seeding ${mockLiabilities.length} liabilities...`);
    for (const liab of mockLiabilities) {
      await client.query(
        `INSERT INTO liabilities (id, user_id, name, category, original_amount, outstanding, interest_rate, monthly_payment, start_date, due_date, status, description)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [
          liab.id,
          mockUser.id,
          liab.name,
          liab.category,
          liab.originalAmount || 0,
          liab.outstanding || 0,
          liab.interestRate || 0,
          liab.monthlyPayment || 0,
          liab.startDate || "",
          liab.dueDate || "",
          liab.status || "Active",
          liab.description || "",
        ],
      );
    }

    console.log(`Seeding ${mockTransactions.length} transactions...`);
    for (const tx of mockTransactions) {
      await client.query(
        `INSERT INTO transactions (id, user_id, date, title, type, category, amount, account, note)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          tx.id,
          mockUser.id,
          tx.date,
          tx.title,
          tx.type,
          tx.category,
          tx.amount,
          tx.account || "",
          tx.note || "",
        ],
      );
    }

    // Verify row counts
    const counts = await Promise.all([
      client.query("SELECT count(*) FROM users"),
      client.query("SELECT count(*) FROM assets"),
      client.query("SELECT count(*) FROM liabilities"),
      client.query("SELECT count(*) FROM transactions"),
    ]);

    console.log("\n--- Verification Summary ---");
    console.log(`Users in DB:        ${counts[0].rows[0].count}`);
    console.log(`Assets in DB:       ${counts[1].rows[0].count}`);
    console.log(`Liabilities in DB:  ${counts[2].rows[0].count}`);
    console.log(`Transactions in DB: ${counts[3].rows[0].count}`);
    console.log("----------------------------");
    console.log("PostgreSQL Database on Render successfully initialized and seeded!");
  } finally {
    client.release();
    await pool.end();
  }
}

run().catch((err) => {
  console.error("Initialization error:", err);
  process.exit(1);
});
