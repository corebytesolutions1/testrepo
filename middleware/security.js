const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// Content Security Policy allows the CDN assets this template uses
// (Tailwind Play CDN, AOS, Lucide icons, Google Fonts). Tighten this
// further once assets are self-hosted / bundled for production.
const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com", "https://unpkg.com", "https://cdn.jsdelivr.net"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdn.jsdelivr.net"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.emailjs.com"],
      frameSrc: ["'self'"]
    }
  }
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again later."
});

module.exports = { helmetConfig, limiter };
