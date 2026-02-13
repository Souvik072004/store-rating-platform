const pool = require("../config/db");

exports.getStores = async (req, res, next) => {
  try {
    const { search = "", page = 1, limit = 5 } = req.query;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      `
      SELECT stores.id, stores.name,
      COALESCE(ROUND(AVG(ratings.rating),1),0) as rating
      FROM stores
      LEFT JOIN ratings ON stores.id = ratings.store_id
      WHERE stores.name ILIKE $1
      GROUP BY stores.id
      ORDER BY stores.id ASC
      LIMIT $2 OFFSET $3
      `,
      [`%${search}%`, limit, offset]
    );

    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

exports.addStore = async (req, res, next) => {
  try {
    const { name } = req.body;
    const result = await pool.query(
      "INSERT INTO stores(name) VALUES($1) RETURNING *",
      [name]
    );
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};
