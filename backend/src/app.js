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

app.get("/", (req, res) => {
  res.send("Store Rating Backend Running 🚀");
});

app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.send(result.rows);
  } catch (err) {
    res.status(500).send("Database connection failed");
  }
});



// ================= USER AUTH =================

// SIGNUP
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    const result = await pool.query(
      "INSERT INTO users (name, email, password, address, role) VALUES ($1,$2,$3,$4,$5) RETURNING id,name,email,role",
      [name, email, password, address, role || "user"]
    );

    res.send(result.rows[0]);
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

    res.send({
      message: "Login successful",
      user: result.rows[0],
    });
  } catch (err) {
    res.status(500).send("Login failed");
  }
});



// ================= STORE CRUD =================

// ADD STORE (ADMIN ONLY)
app.post("/add-store", async (req, res) => {
  try {
    const { name, userId } = req.body;

    const userCheck = await pool.query(
      "SELECT role FROM users WHERE id=$1",
      [userId]
    );

    if (userCheck.rows.length === 0 || userCheck.rows[0].role !== "admin") {
      return res.status(403).send("Only admin can add stores");
    }

    const result = await pool.query(
      "INSERT INTO stores (name) VALUES ($1) RETURNING *",
      [name]
    );

    res.send(result.rows[0]);
  } catch (err) {
    res.status(500).send("Insert failed");
  }
});

// GET ALL STORES
app.get("/stores", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM stores ORDER BY id");
    res.send(result.rows);
  } catch {
    res.status(500).send("Fetch failed");
  }
});

// UPDATE STORE
app.put("/update-store/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const result = await pool.query(
      "UPDATE stores SET name=$1 WHERE id=$2 RETURNING *",
      [name, id]
    );

    res.send(result.rows[0]);
  } catch {
    res.status(500).send("Update failed");
  }
});

// DELETE STORE
app.delete("/delete-store/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM stores WHERE id=$1", [id]);
    res.send("Store deleted");
  } catch {
    res.status(500).send("Delete failed");
  }
});



// ================= RATINGS =================

// RATE STORE
app.post("/rate-store/:storeId", async (req, res) => {
  try {
    const { storeId } = req.params;
    const { rating, review } = req.body;

    const result = await pool.query(
      "INSERT INTO ratings (store_id,rating,review) VALUES ($1,$2,$3) RETURNING *",
      [storeId, rating, review]
    );

    res.send(result.rows[0]);
  } catch {
    res.status(500).send("Rating failed");
  }
});

// STORE WITH AVG RATING
app.get("/stores-with-ratings", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.id, s.name, COALESCE(AVG(r.rating),0) AS avg_rating
      FROM stores s
      LEFT JOIN ratings r ON s.id=r.store_id
      GROUP BY s.id
      ORDER BY s.id
    `);

    res.send(result.rows);
  } catch {
    res.status(500).send("Fetch failed");
  }
});

// SINGLE STORE DETAILS
app.get("/store/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      SELECT s.id, s.name, COALESCE(AVG(r.rating),0) AS avg_rating
      FROM stores s
      LEFT JOIN ratings r ON s.id=r.store_id
      WHERE s.id=$1
      GROUP BY s.id
    `, [id]);

    if (result.rows.length === 0) return res.status(404).send("Store not found");

    res.send(result.rows[0]);
  } catch {
    res.status(500).send("Failed to fetch store");
  }
});

// STORE REVIEWS
app.get("/reviews/:storeId", async (req, res) => {
  try {
    const { storeId } = req.params;

    const result = await pool.query(
      "SELECT rating, review FROM ratings WHERE store_id=$1",
      [storeId]
    );

    res.send(result.rows);
  } catch {
    res.status(500).send("Failed to fetch reviews");
  }
});



const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
