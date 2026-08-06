import { rateLimit } from 'express-rate-limit';
import { env } from '../config/env';

export const apiRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  limit: env.RATE_LIMIT_MAX,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      type: 'about:blank',
      title: 'Too Many Requests',
      status: 429,
      code: 'RATE_LIMITED',
      detail: 'Too many requests. Please try again later.',
      instance: req.originalUrl,
      requestId: req.requestId,
    });
  },
});
