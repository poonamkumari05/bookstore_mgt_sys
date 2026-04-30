const express = require("express");

const router = express.Router();

const protect = require("../middlewares/authMiddleware");

const adminOnly = require("../middlewares/roleMiddleware");

const {
  createAuthor,
  getAuthors,
  getAuthorById,
  updateAuthor,
  deleteAuthor,
} = require("../controllers/authorController");

router.get("/", getAuthors);

router.get("/:id", getAuthorById);

router.post("/", protect, adminOnly, createAuthor);

router.put("/:id", protect, adminOnly, updateAuthor);

router.delete("/:id", protect, adminOnly, deleteAuthor);

module.exports = router;
