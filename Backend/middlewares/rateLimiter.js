const rateLimit = require("express-rate-limit");

const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: {
    reply: "Whoa there! You're talking too fast. Please wait a minute.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { chatLimiter };