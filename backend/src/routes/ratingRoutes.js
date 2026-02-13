const express = require("express");
const { rateStore } = require("../controllers/ratingController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, rateStore);

module.exports = router;
