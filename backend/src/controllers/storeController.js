const pool = require("../config/db");

exports.getStores = async (req, res) => {
  try {
    const stores = await pool.query("SELECT * FROM stores");
    res.json(stores.rows);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
