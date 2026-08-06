import morgan from 'morgan';
import type { Request } from 'express';
import { logger } from '../config/logger';
import { env } from '../config/env';

morgan.token('request-id', (req) => (req as Request).requestId ?? '-');

// Stream morgan output to winston logger
const stream = {
  write: (message: string) => logger.info(message.trim()),
};

export const morganMiddleware = morgan(
  env.NODE_ENV === 'production'
    ? ':remote-addr :method :url :status :response-time ms requestId=:request-id'
    : ':method :url :status :response-time ms requestId=:request-id',
  { stream }
);
