import type { Request, Response } from 'express';
import { rateLimit } from 'express-rate-limit';
import { env } from '../config/env';

const rateLimitHandler = (req: Request, res: Response): void => {
  res.status(429).json({
    type: 'about:blank',
    title: 'Too Many Requests',
    status: 429,
    code: 'RATE_LIMITED',
    detail: 'Too many requests. Please try again later.',
    instance: req.originalUrl,
    requestId: req.requestId,
  });
};

const commonOptions = {
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: rateLimitHandler,
} as const;

export const apiRateLimiter = rateLimit({
  ...commonOptions,
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  limit: env.RATE_LIMIT_MAX,
});

export const authIpRateLimiter = rateLimit({
  ...commonOptions,
  windowMs: 5 * 60 * 1000,
  limit: 5,
  skip: () => env.NODE_ENV === 'test',
});

export const authEmailRateLimiter = rateLimit({
  ...commonOptions,
  windowMs: 5 * 60 * 1000,
  limit: 5,
  skip: (req) => env.NODE_ENV === 'test' || typeof req.body?.email !== 'string',
  keyGenerator: (req) => req.body.email,
});
