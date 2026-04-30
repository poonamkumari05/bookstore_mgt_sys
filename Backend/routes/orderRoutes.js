const express = require("express");

const router = express.Router();

const protect = require("../middlewares/authMiddleware");

const adminOnly = require("../middlewares/roleMiddleware");

const {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
    checkout,
} = require("../controllers/orderController");

// Consumer place order

router.post("/", protect, placeOrder);

// Consumer sees own orders

router.get("/my-orders", protect, getMyOrders);

// Admin sees all orders

router.get("/", protect, adminOnly, getAllOrders);

// Admin updates order status

router.patch("/:id/status", protect, adminOnly, updateOrderStatus);

// CHECKOUT
router.post("/checkout", protect, checkout);

module.exports = router;
