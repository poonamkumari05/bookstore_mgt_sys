const prisma = require("../config/prisma");


// =========================
// ADD BOOK (ADMIN ONLY)
// =========================

exports.createBook = async (req, res) => {
  try {

    const { book_name, price, stock } = req.body;

    if (!book_name || price == null || stock == null) {
      return res.status(400).json({
        message: "book_name, price and stock are required"
      });
    }

    const book = await prisma.books.create({
      data: {
        book_name,
        price,
        stock
      }
    });

    res.status(201).json({
      message: "Book created successfully",
      book
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
};


// =========================
// GET ALL BOOKS
// =========================

exports.getBooks = async (req, res) => {

  try {

    const books = await prisma.books.findMany();

    res.json(books);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};


// =========================
// SEARCH BOOKS
// =========================

exports.searchBooks = async (req, res) => {

  try {

    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        message: "Search query required"
      });
    }

    const books = await prisma.books.findMany({
      where: {
        book_name: {
          contains: query
        }
      }
    });


    if (books.length === 0) {
      return res.status(404).json({
        message: "No books found"
      });
    }


    res.json(books);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};


// =========================
// GET BOOK BY ID
// =========================

exports.getBookById = async (req, res) => {

  try {

    const id = parseInt(req.params.id);

    const book = await prisma.books.findUnique({
      where: {
        book_id: id
      }
    });

    if (!book) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    res.json(book);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};


// =========================
// UPDATE BOOK(ADMIN ONLY)
// =========================

exports.updateBook = async (req, res) => {

  try {

    const id = parseInt(req.params.id);

    const { book_name, price, stock } = req.body;

    const book = await prisma.books.update({
      where: {
        book_id: id
      },

      data: {
        book_name: book_name || undefined,
        price: price ?? undefined,
        stock: stock ?? undefined
      }

    });

    res.json({
      message: "Book updated successfully",
      book
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};


// =========================
// DELETE BOOK(ADMIN ONLY)
// =========================

exports.deleteBook = async (req, res) => {

  try {

    const id = parseInt(req.params.id);

    await prisma.books.delete({
      where: {
        book_id: id
      }
    });

    res.json({
      message: "Book deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};


// =========================
// UPDATE BOOK PRICE ONLY(ADMIN ONLY)
// =========================

exports.updateBookPrice = async (req, res) => {

  try {

    const id = parseInt(req.params.id);

    const { price } = req.body;

    if (price == null) {
      return res.status(400).json({
        message: "Price is required"
      });
    }

    const book = await prisma.books.update({
      where: {
        book_id: id
      },

      data: {
        price
      }

    });

    res.json({
      message: "Price updated successfully",
      book
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};