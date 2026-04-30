const prisma = require("../config/prisma");

// CREATE AUTHOR (Admin only)

exports.createAuthor = async (req, res) => {
  try {
    const { author_name, email } = req.body;

    if (!author_name) {
      return res.status(400).json({
        message: "Author name required",
      });
    }

    const author = await prisma.authors.create({
      data: {
        author_name,
        email,
      },
    });

    res.status(201).json({
      message: "Author created successfully",
      author,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// GET ALL AUTHORS

exports.getAuthors = async (req, res) => {
  try {
    const authors = await prisma.authors.findMany();

    res.json(authors);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// GET AUTHOR BY ID

exports.getAuthorById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const author = await prisma.authors.findUnique({
      where: {
        author_id: id,
      },
    });

    if (!author) {
      return res.status(404).json({
        message: "Author not found",
      });
    }

    res.json(author);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// UPDATE AUTHOR

exports.updateAuthor = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const { author_name, email } = req.body;

    const author = await prisma.authors.update({
      where: {
        author_id: id,
      },

      data: {
        author_name: author_name || undefined,
        email: email || undefined,
      },
    });

    res.json({
      message: "Author updated",
      author,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// DELETE AUTHOR

exports.deleteAuthor = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    await prisma.authors.delete({
      where: {
        author_id: id,
      },
    });

    res.json({
      message: "Author deleted",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
