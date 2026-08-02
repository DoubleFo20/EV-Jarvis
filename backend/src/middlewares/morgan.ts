import morgan from 'morgan';
import { logger } from '../config/logger';
import { env } from '../config/env';

// Stream morgan output to winston logger
const stream = {
  write: (message: string) => logger.info(message.trim()),
};

export const morganMiddleware = morgan(
  env.NODE_ENV === 'production' ? 'combined' : 'dev',
  { stream }
);
