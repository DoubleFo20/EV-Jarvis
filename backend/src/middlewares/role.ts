import type { RequestHandler } from 'express';
import type { SystemRole } from '../types/auth';
import { AppError } from '../utils/app-error';

export const requireRole = (...allowedRoles: readonly SystemRole[]): RequestHandler =>
  (req, _res, next) => {
    if (!req.user) {
      return next(new AppError(401, 'AUTHENTICATION_REQUIRED', 'Authentication is required'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError(403, 'INSUFFICIENT_ROLE', 'Insufficient permission'));
    }

    return next();
  };
