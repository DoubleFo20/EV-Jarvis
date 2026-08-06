import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';
import { AppError } from '../utils/app-error';

type RequestSource = 'body' | 'params' | 'query';

export const validate = (schema: ZodType, source: RequestSource = 'body'): RequestHandler =>
  (req, _res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      return next(new AppError(400, 'VALIDATION_ERROR', 'Request validation failed'));
    }

    Object.assign(req[source], result.data);
    return next();
  };
