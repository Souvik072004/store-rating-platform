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
  return /connect|timeout|database|relation.*does not exist|syntax|does not exist/i.test(msg) || false;
};

exports.getStats = async (req, res) => {
  try {
    if (shouldUseDemo()) {
      return res.json(demoService.getStats());
    }

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
    if (shouldUseDemo() || isLikelyDbUnavailable(error)) {
      return res.json(demoService.getStats());
    }
    res.status(500).json({ message: "Server error" });
  }
};
