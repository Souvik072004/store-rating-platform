const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

let dbAvailable = false;

// Try to connect once at startup so we can gracefully fall back to demo mode.
pool.connect()
  .then(() => {
    dbAvailable = true;
    console.log("✅ PostgreSQL Connected");
  })
  .catch((err) => {
    dbAvailable = false;
    const msg = err?.message || err;
    console.error("❌ DB Connection Error:", msg);
    if (!process.env.DATABASE_URL) {
      console.error("❌ DATABASE_URL is not set.");
    }
  });

// Used by controllers to decide whether to use in-memory demo data.
pool.isDbAvailable = () => dbAvailable;

module.exports = pool;