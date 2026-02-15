const express = require("express");
const router = express.Router();

const { getRatings } = require("../controllers/ratingController");

router.get("/", getRatings);

module.exports = router;
