const express = require("express");

const router = express.Router();

const protect = require("../middlewares/authMiddleware");

const adminOnly = require("../middlewares/roleMiddleware");

const {
  createBook,
  getBooks,
  updateBook,
  deleteBook,
  getBookById,
  updateBookPrice,
  searchBooks,
} = require("../controllers/bookController");

router.get("/", getBooks);
router.get("/search", searchBooks);
router.get("/:id", getBookById);

router.post("/", protect, adminOnly, createBook);

router.put("/:id", protect, adminOnly, updateBook);

router.patch("/:id/price", protect, adminOnly, updateBookPrice);

router.delete("/:id", protect, adminOnly, deleteBook);

module.exports = router;
