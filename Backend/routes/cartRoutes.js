const express = require("express");

const router = express.Router();

const protect = require("../middlewares/authMiddleware");

const {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
} = require("../controllers/cartController");

router.post("/add", protect, addToCart);

router.get("/", protect, getCart);

router.patch("/update/:id", protect, updateCartItem);

router.delete("/remove/:id", protect, removeCartItem);

module.exports = router;
