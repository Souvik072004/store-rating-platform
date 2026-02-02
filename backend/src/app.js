const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "store_rating",
  password: "1234",
  port: 5432,
});

// ================= ROOT =================
app.get("/", (req, res) => {
  res.send("Backend Running 🚀");
});

// ================= AUTH =================

// SIGNUP
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    const result = await pool.query(
      "INSERT INTO users (name,email,password,address,role) VALUES ($1,$2,$3,$4,$5) RETURNING id,name,email,role",
      [name, email, password, address, role || "user"]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send("Signup failed");
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT id,name,role FROM users WHERE email=$1 AND password=$2",
      [email, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).send("Invalid credentials");
    }

    res.json({ user: result.rows[0] });
  } catch {
    res.status(500).send("Login failed");
  }
});

// ================= STORES =================

// ADD STORE (ADMIN)
app.post("/add-store", async (req, res) => {
  const { name, userId } = req.body;

  const roleCheck = await pool.query(
    "SELECT role FROM users WHERE id=$1",
    [userId]
  );

  if (roleCheck.rows[0]?.role !== "admin") {
    return res.status(403).send("Only admin can add stores");
  }

  const result = await pool.query(
    "INSERT INTO stores (name) VALUES ($1) RETURNING *",
    [name]
  );

  res.json(result.rows[0]);
});

// GET STORES WITH AVG RATING
app.get("/stores-with-ratings", async (req, res) => {
  const result = await pool.query(`
    SELECT 
      stores.id,
      stores.name,
      COALESCE(ROUND(AVG(ratings.rating),1),0) AS rating
    FROM stores
    LEFT JOIN ratings ON stores.id = ratings.store_id
    GROUP BY stores.id
    ORDER BY stores.id ASC
  `);

  res.json(result.rows);
});

// DELETE STORE
app.delete("/delete-store/:id", async (req, res) => {
  await pool.query("DELETE FROM stores WHERE id=$1", [req.params.id]);
  res.send("Deleted");
});

// UPDATE STORE NAME
app.put("/update-store/:id", async (req, res) => {
  const { name } = req.body;

  const result = await pool.query(
    "UPDATE stores SET name=$1 WHERE id=$2 RETURNING *",
    [name, req.params.id]
  );

  res.json(result.rows[0]);
});

// ================= RATINGS =================

// ADD RATING + REVIEW
app.post("/rate-store", async (req, res) => {
  const { storeId, rating, review } = req.body;

  await pool.query(
    "INSERT INTO ratings (store_id,rating,review) VALUES ($1,$2,$3)",
    [storeId, rating, review]
  );

  res.send("Rating added");
});

// GET REVIEWS FOR STORE
app.get("/reviews/:storeId", async (req, res) => {
  const result = await pool.query(
    "SELECT rating,review FROM ratings WHERE store_id=$1",
    [req.params.storeId]
  );

  res.json(result.rows);
});

// ================= SERVER =================
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
