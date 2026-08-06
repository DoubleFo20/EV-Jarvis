import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';
import { env } from '../config/env';
import { AppError } from '../utils/app-error';

export const errorHandler = (err: unknown, req: Request, res: Response, _next: NextFunction) => {
  const appError = err instanceof AppError ? err : null;
  const error = err instanceof Error ? err : new Error('Unknown error');
  const statusCode = appError?.statusCode ?? 500;

  logger.error('Request failed', {
    message: error.message,
    stack: env.NODE_ENV === 'production' ? undefined : error.stack,
    method: req.method,
    url: req.originalUrl,
    requestId: req.requestId,
  });

  res.status(statusCode).json({
    type: 'about:blank',
    title: appError?.name ?? 'Internal Server Error',
    status: statusCode,
    code: appError?.code ?? 'INTERNAL_SERVER_ERROR',
    detail: appError?.message ?? 'An unexpected error occurred',
    instance: req.originalUrl,
    requestId: req.requestId,
  });
};
