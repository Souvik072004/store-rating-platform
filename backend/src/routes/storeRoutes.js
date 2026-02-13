const express = require("express");
const { getStores, addStore } = require("../controllers/storeController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getStores);
router.post("/", protect, adminOnly, addStore);

module.exports = router;
