const pool = require("../config/db");
const demoService = require("../demo/demoService");

const shouldUseDemo = () => {
  if (process.env.DEMO_MODE === "true") return true;
  return !pool.isDbAvailable?.();
};

const isLikelyDbUnavailable = (error) => {
  const code = error?.code;
  const msg = (error?.message || "").toLowerCase();
  if (!process.env.DATABASE_URL) return true;
  if (["ECONNREFUSED", "ENOTFOUND"].includes(code)) return true;
  return (
    /connect|timeout|database|relation.*does not exist|syntax|does not exist|permission/i.test(msg) ||
    false
  );
};

const getStores = async (req, res) => {
  try {
    if (shouldUseDemo()) {
      return res.json(demoService.getStores());
    }

    let result;
    try {
      result = await pool.query(
        `SELECT s.id, s.name, s.address,
          (SELECT ROUND(AVG(rating)::numeric, 1) FROM ratings WHERE store_id = s.id) AS rating
         FROM stores s ORDER BY s.id DESC`
      );
    } catch (e) {
      if (e.code === "42P01") {
        result = await pool.query("SELECT * FROM stores ORDER BY id DESC");
      } else throw e;
    }
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    if (shouldUseDemo() || isLikelyDbUnavailable(error)) {
      return res.json(demoService.getStores());
    }
    res.status(500).json({ message: "Server error" });
  }
};

const createStore = async (req, res) => {
  try {
    if (shouldUseDemo()) {
      const { name, address } = req.body;
      const created = demoService.createStore({ name, address });
      return res.status(201).json(created);
    }

    const { name, address } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Store name is required" });
    }

    const result = await pool.query(
      "INSERT INTO stores (name, address) VALUES ($1, $2) RETURNING *",
      [name, address]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    if (shouldUseDemo() || isLikelyDbUnavailable(error)) {
      const { name, address } = req.body;
      const created = demoService.createStore({ name, address });
      return res.status(201).json(created);
    }
    res.status(500).json({ message: "Server error" });
  }
};

const deleteStore = async (req, res) => {
  try {
    if (shouldUseDemo()) {
      const { id } = req.params;
      const ok = demoService.deleteStore(id);
      if (!ok) return res.status(404).json({ message: "Store not found" });
      return res.status(200).json({ message: "Store deleted" });
    }

    const { id } = req.params;
    await pool.query("DELETE FROM stores WHERE id = $1", [id]);
    res.status(200).json({ message: "Store deleted" });
  } catch (error) {
    console.error(error);
    if (shouldUseDemo() || isLikelyDbUnavailable(error)) {
      const { id } = req.params;
      const ok = demoService.deleteStore(id);
      if (!ok) return res.status(404).json({ message: "Store not found" });
      return res.status(200).json({ message: "Store deleted" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getStores,
  createStore,
  deleteStore
};
