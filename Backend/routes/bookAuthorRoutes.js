const express = require("express");

const router = express.Router();

const protect = require("../middlewares/authMiddleware");

const adminOnly = require("../middlewares/roleMiddleware");

const {
  assignAuthorToBook,
  getAuthorsByBook,
  getBooksByAuthor,
  removeMapping,
} = require("../controllers/bookAuthorController");

router.post("/assign", protect, adminOnly, assignAuthorToBook);

router.get("/book/:bookId", getAuthorsByBook);

router.get("/author/:authorId", getBooksByAuthor);

router.delete("/remove", protect, adminOnly, removeMapping);

module.exports = router;
