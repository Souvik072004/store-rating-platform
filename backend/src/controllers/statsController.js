const pool = require("../config/db");

exports.getStats = async (req, res) => {
  try {
    const [storesRes, usersRes] = await Promise.all([
      pool.query("SELECT COUNT(*)::int AS count FROM stores"),
      pool.query("SELECT COUNT(*)::int AS count FROM users")
    ]);

    let totalRatings = 0;
    let averageRating = 0;
    try {
      const ratingsRes = await pool.query(
        "SELECT COUNT(*)::int AS count, COALESCE(ROUND(AVG(rating)::numeric, 1), 0) AS avg_rating FROM ratings"
      );
      totalRatings = parseInt(ratingsRes.rows[0]?.count, 10) || 0;
      averageRating = Number(ratingsRes.rows[0]?.avg_rating) || 0;
    } catch (_) {
      // ratings table may not exist yet
    }

    const totalStores = parseInt(storesRes.rows[0]?.count, 10) || 0;
    const totalUsers = parseInt(usersRes.rows[0]?.count, 10) || 0;

    res.json({
      totalStores,
      totalUsers,
      totalRatings,
      averageRating
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
