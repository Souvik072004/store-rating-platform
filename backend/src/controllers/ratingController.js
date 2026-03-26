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

exports.getRatings = async (req, res) => {
  try {
    res.json({ message: "Ratings working" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.submitRating = async (req, res) => {
  try {
    const { store_id, rating } = req.body;
    const userId = req.user.id;

    if (!store_id || rating == null) {
      return res.status(400).json({ message: "store_id and rating (1-5) are required" });
    }
    const r = Number(rating);
    if (r < 1 || r > 5 || !Number.isInteger(r)) {
      return res.status(400).json({ message: "Rating must be an integer between 1 and 5" });
    }

    if (shouldUseDemo()) {
      demoService.submitRating({ store_id, userId, rating: r });
      return res.status(200).json({ message: "Rating saved" });
    }

    await pool.query(
      `INSERT INTO ratings (store_id, user_id, rating)
       VALUES ($1, $2, $3)
       ON CONFLICT (store_id, user_id) DO UPDATE SET rating = $3`,
      [store_id, userId, r]
    );
    res.status(200).json({ message: "Rating saved" });
  } catch (error) {
    console.error(error);
    if (shouldUseDemo() || isLikelyDbUnavailable(error)) {
      const { store_id, rating } = req.body;
      const userId = req.user?.id;
      const r = Number(rating);
      demoService.submitRating({ store_id, userId, rating: r });
      return res.status(200).json({ message: "Rating saved" });
    }
    res.status(500).json({ message: "Server error" });
  }
};
