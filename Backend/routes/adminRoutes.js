const express = require("express");
const router = express.Router();

const protect = require("../middlewares/authMiddleware");
const adminOnly = require("../middlewares/roleMiddleware");

const { getDashboard } = require("../controllers/adminController");

router.get("/dashboard", protect, adminOnly, getDashboard);

module.exports = router;