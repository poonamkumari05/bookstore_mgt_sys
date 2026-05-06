const { chatWithGemini } = require("../services/geminiService");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// 🧠 Intent detection (important for optimization)
const detectIntent = (msg) => {
  const text = msg.toLowerCase();

  if (text.includes("under") || text.includes("price")) return "PRICE";
  if (text.includes("author")) return "AUTHOR";
  if (text.includes("book")) return "BOOK";

  return "AI";
};

const chatController = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.json({ reply: "Please type something 🙂" });
    }

    const cleanMsg = message.trim().toLowerCase();
    const intent = detectIntent(cleanMsg);

    // 🟢 1. PRICE SEARCH (DB FIRST)
    if (intent === "PRICE") {
      const priceMatch = cleanMsg.match(/\d+/);

      if (priceMatch) {
        const price = Number(priceMatch[0]);

        const books = await prisma.books.findMany({
          where: {
            price: { lte: price },
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
      }
    }

    // 🟢 2. BOOK SEARCH (DB FIRST)
    if (intent === "BOOK") {
      const keyword = cleanMsg.split(" ").pop();

      const books = await prisma.books.findMany({
        where: {
          book_name: {
            contains: keyword,
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
    }

    // 🟢 3. AUTHOR SEARCH (DB FIRST)
    if (intent === "AUTHOR") {
      const keyword = cleanMsg.split(" ").pop();

      const results = await prisma.book_authors.findMany({
        where: {
          author: {
            author_name: {
              contains: keyword, // ❌ removed mode (fixed Prisma error)
            },
          },
        },
        include: { book: true, author: true },
        take: 5,
      });

      if (results.length > 0) {
        return res.json({
          reply: results
            .map(
              (r, i) =>
                `${i + 1}. ${r.book.book_name} by ${r.author.author_name}`
            )
            .join("\n"),
        });
      }
    }

    // 🔵 4. AI FALLBACK (ONLY WHEN DB FAILS)
    const aiReply = await chatWithGemini(cleanMsg);

    return res.json({ reply: aiReply });

  } catch (error) {
    console.error("Controller Error 👉", error);
    return res.status(500).json({
      reply: "Server error",
    });
  }
};

module.exports = { chatController };