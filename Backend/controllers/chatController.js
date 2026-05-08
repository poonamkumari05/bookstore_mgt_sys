const { PrismaClient } = require("@prisma/client");
const { chatWithGemini } = require("../services/geminiService");

const prisma = new PrismaClient();

const greetings = [
  "hi",
  "hello",
  "hey",
  "hii",
  "good morning",
  "good evening",
];

const chatController = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.json({
        reply: "Please type something 🙂",
      });
    }

    const cleanMsg = message.toLowerCase().trim();

    // ✅ Greeting Handling
    if (greetings.includes(cleanMsg)) {
      return res.json({
        reply:
          "Hello 👋 Welcome to Online Bookstore. Ask me about books, authors, prices, or recommendations 📚",
      });
    }

    // ✅ 1. Search Books by Name
    const books = await prisma.books.findMany({
      where: {
        book_name: {
          contains: cleanMsg,
        },
      },
      take: 5,
    });

    if (books.length > 0) {
      return res.json({
        reply: books
          .map((b, i) => `${i + 1}. ${b.book_name} - ₹${b.price}`)
          .join("\n"),
      });
    }

    // ✅ 2. Search Authors
    const authors = await prisma.book_authors.findMany({
      where: {
        author: {
          author_name: {
            contains: cleanMsg,
          },
        },
      },
      include: {
        author: true,
        book: true,
      },
      take: 5,
    });

    if (authors.length > 0) {
      return res.json({
        reply: authors
          .map(
            (a, i) =>
              `${i + 1}. ${a.book.book_name} by ${a.author.author_name}`
          )
          .join("\n"),
      });
    }

    // ✅ 3. Price Search
    const priceMatch = cleanMsg.match(/\d+/);

    if (priceMatch) {
      const price = Number(priceMatch[0]);

      const cheapBooks = await prisma.books.findMany({
        where: {
          price: {
            lte: price,
          },
        },
        take: 5,
      });

      if (cheapBooks.length > 0) {
        return res.json({
          reply: cheapBooks
            .map((b, i) => `${i + 1}. ${b.book_name} - ₹${b.price}`)
            .join("\n"),
        });
      }
    }

    // ✅ 4. Gemini Fallback
    const aiReply = await chatWithGemini(cleanMsg);

    return res.json({
      reply: aiReply,
    });
  } catch (error) {
    console.error("CHAT ERROR 👉", error);

    return res.status(500).json({
      reply: "Server error",
    });
  }
};

module.exports = { chatController };