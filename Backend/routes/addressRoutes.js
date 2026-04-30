const express = require("express");

const router = express.Router();

const protect = require("../middlewares/authMiddleware");


const {
  createAddress,
  getMyAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
} = require("../controllers/addressController");

router.post("/", protect, createAddress);

router.get("/", protect, getMyAddresses);

router.get("/:id", protect, getAddressById);

router.put("/:id", protect,  updateAddress);

router.delete("/:id", protect, deleteAddress);

module.exports = router;
