import type { RequestHandler } from 'express';
import { authService } from '../modules/auth/auth.service';
import { asyncHandler } from '../utils/async-handler';

export const requireAuth: RequestHandler = asyncHandler(async (req, _res, next) => {
  req.user = await authService.authenticate(req.headers.authorization);
  next();
});
