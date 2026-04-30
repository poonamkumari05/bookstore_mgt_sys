const express = require("express");

const router = express.Router();

const protect = require("../middlewares/authMiddleware");

const adminOnly = require("../middlewares/roleMiddleware");

const {
  createPayment,
  getMyPayments,
  getAllPayments,
} = require("../controllers/paymentController");

// consumer

router.post("/", protect, createPayment);

router.get("/my-payments", protect, getMyPayments);

// admin

router.get("/", protect, adminOnly, getAllPayments);

module.exports = router;
