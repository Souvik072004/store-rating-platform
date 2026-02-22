const express = require("express");
const router = express.Router();

const { getRatings, submitRating } = require("../controllers/ratingController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", getRatings);
router.post("/", protect, submitRating);

module.exports = router;
