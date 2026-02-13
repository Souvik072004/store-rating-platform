const pool = require("../config/db");

exports.rateStore = async (req, res, next) => {
  try {
    const { storeId, rating, review } = req.body;
    const userId = req.user.id;

    const exists = await pool.query(
      "SELECT * FROM ratings WHERE store_id=$1 AND user_id=$2",
      [storeId, userId]
    );

    if (exists.rows.length) {
      await pool.query(
        "UPDATE ratings SET rating=$1,review=$2 WHERE store_id=$3 AND user_id=$4",
        [rating, review, storeId, userId]
      );
      return res.json({ message: "Rating updated" });
    }

    await pool.query(
      "INSERT INTO ratings(store_id,user_id,rating,review) VALUES($1,$2,$3,$4)",
      [storeId, userId, rating, review]
    );

    res.json({ message: "Rating added" });
  } catch (err) {
    next(err);
  }
};
