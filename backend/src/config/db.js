const { Pool } = require("pg");
require("dotenv").config();

function shouldUseSsl(connectionString) {
  if (!connectionString) return false;
  if (process.env.PGSSLMODE === "disable") return false;
  // Local dev DBs usually don't have SSL enabled.
  if (connectionString.includes("localhost") || connectionString.includes("127.0.0.1")) return false;
  // Render/managed Postgres typically requires SSL.
  return true;
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ...(shouldUseSsl(process.env.DATABASE_URL)
    ? { ssl: { rejectUnauthorized: false } }
    : {}),
});

let dbAvailable = false;

async function checkDbConnection() {
  try {
    const client = await pool.connect();
    client.release();
    if (!dbAvailable) console.log("✅ PostgreSQL Connected");
    dbAvailable = true;
  } catch (err) {
    dbAvailable = false;
    const msg = err?.message || err;
    console.error("❌ DB Connection Error:", msg);
    if (!process.env.DATABASE_URL) {
      console.error("❌ DATABASE_URL is not set.");
    }
  }
}

// Check once at startup and keep retrying (helps on cold starts / DB wake-ups).
checkDbConnection();
const retryMs = Number(process.env.DB_RETRY_MS || 10000);
const retryTimer = setInterval(checkDbConnection, retryMs);
retryTimer.unref?.();

// Used by controllers to decide whether to use in-memory demo data.
pool.isDbAvailable = () => dbAvailable;

module.exports = pool;