const prisma = require("../config/prisma");

// MAP AUTHOR TO BOOK

exports.assignAuthorToBook = async (req, res) => {
  try {
    const { book_id, author_id } = req.body;

    /* check book */

    const book = await prisma.books.findUnique({
      where: {
        book_id,
      },
    });

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    /* check author */

    const author = await prisma.authors.findUnique({
      where: {
        author_id,
      },
    });

    if (!author) {
      return res.status(404).json({
        message: "Author not found",
      });
    }

    /* prevent duplicate mapping */

    const existingMap = await prisma.book_authors.findUnique({
      where: {
        book_id_author_id: {
          book_id,
          author_id,
        },
      },
    });

    if (existingMap) {
      return res.status(400).json({
        message: "Mapping already exists",
      });
    }

    /* create mapping */

    const mapping = await prisma.book_authors.create({
      data: {
        book_id,
        author_id,
      },
    });

    res.status(201).json({
      message: "Author mapped to book successfully",
      mapping,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// Get Authors of a Book

exports.getAuthorsByBook = async (req, res) => {
  try {
    const id = parseInt(req.params.bookId);

    const book = await prisma.books.findUnique({
      where: {
        book_id: id,
      },

      include: {
        book_authors: {
          include: {
            author: true,
          },
        },
      },
    });

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    res.json(book);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// Get Books of an Author

exports.getBooksByAuthor = async (req, res) => {
  try {
    const id = parseInt(req.params.authorId);

    const author = await prisma.authors.findUnique({
      where: {
        author_id: id,
      },

      include: {
        book_authors: {
          include: {
            book: true,
          },
        },
      },
    });

    res.json(author);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// Unmap Author from Book

exports.removeMapping = async (req, res) => {
  try {
    const { book_id, author_id } = req.body;

    await prisma.book_authors.delete({
      where: {
        book_id_author_id: {
          book_id,
          author_id,
        },
      },
    });

    res.json({
      message: "Mapping removed successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
