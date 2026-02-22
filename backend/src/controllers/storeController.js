const pool = require("../config/db");

const getStores = async (req, res) => {
  try {
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
    res.status(500).json({ message: "Server error" });
  }
};

const createStore = async (req, res) => {
  try {
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
    res.status(500).json({ message: "Server error" });
  }
};

const deleteStore = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM stores WHERE id = $1", [id]);
    res.status(200).json({ message: "Store deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getStores,
  createStore,
  deleteStore
};
