import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

// Standard RFC 7807 Error Response
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const errorHandler = (err: any, req: Request, res: Response, _next: NextFunction) => {
  logger.error('Unhandled Exception:', {
    message: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
  });

  const statusCode = err.status || err.statusCode || 500;
  
  res.status(statusCode).json({
    type: 'about:blank',
    title: err.name || 'Internal Server Error',
    status: statusCode,
    detail: err.message || 'An unexpected error occurred',
    instance: req.originalUrl,
  });
};
