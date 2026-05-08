const express = require("express");
const cors = require("cors");

const app = express();


// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/books", require("./routes/bookRoutes"));
app.use("/api/authors", require("./routes/authorRoutes"));
app.use("/api/book-authors", require("./routes/bookAuthorRoutes"));
app.use("/api/addresses", require("./routes/addressRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));
app.get("/", (req, res) => {
  res.send("Welcome to the Online Bookstore Management System API");
});

module.exports = app;