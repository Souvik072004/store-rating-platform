const express = require("express");
const router = express.Router();

const {
  createStore,
  getStores,
  deleteStore
} = require("../controllers/storeController");

const { protect, admin } = require("../middleware/authMiddleware");

// Get all stores
router.get("/", getStores);

// Create store (Admin only)
router.post("/", protect, admin, createStore);

// Delete store (Admin only)
router.delete("/:id", protect, admin, deleteStore);

module.exports = router;
