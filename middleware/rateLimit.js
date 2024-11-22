const rateLimit = require('express-rate-limit');

// Configuration du rate limiter
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  headers: true, 

handler: (req, res, next) => {
  res.status(429).json({ error: 'Trop de tentatives de connexion. Veuillez réessayer plus tard.' });
}
});

module.exports = rateLimiter;