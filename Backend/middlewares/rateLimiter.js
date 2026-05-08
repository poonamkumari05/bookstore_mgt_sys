const rateLimit = require("express-rate-limit");

const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute

  max: 30, // allow 30 requests

  message: {
    reply:
      "Too many messages sent 🚫 Please wait a few seconds and try again.",
  },

  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { chatLimiter };