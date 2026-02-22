const pool = require("../config/db");

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

    await pool.query(
      `INSERT INTO ratings (store_id, user_id, rating)
       VALUES ($1, $2, $3)
       ON CONFLICT (store_id, user_id) DO UPDATE SET rating = $3`,
      [store_id, userId, r]
    );
    res.status(200).json({ message: "Rating saved" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
