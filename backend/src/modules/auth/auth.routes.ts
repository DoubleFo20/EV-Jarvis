import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth';
import {
  authEmailRateLimiter,
  authIpRateLimiter,
} from '../../middlewares/rate-limit';
import { validate } from '../../middlewares/validate';
import { asyncHandler } from '../../utils/async-handler';
import {
  getCurrentProfile,
  login,
  logout,
  refreshSession,
  register,
  resendEmailVerification,
  verifyEmail,
} from './auth.controller';
import {
  emailVerificationSchema,
  loginSchema,
  refreshSessionSchema,
  registerSchema,
  resendEmailVerificationSchema,
} from './auth.schemas';

const router = Router();

router.post(
  '/register',
  authIpRateLimiter,
  validate(registerSchema),
  authEmailRateLimiter,
  asyncHandler(register)
);
router.post(
  '/login',
  authIpRateLimiter,
  validate(loginSchema),
  authEmailRateLimiter,
  asyncHandler(login)
);
router.post('/logout', requireAuth, asyncHandler(logout));
router.post('/refresh', validate(refreshSessionSchema), asyncHandler(refreshSession));
router.post(
  '/email-verification',
  validate(emailVerificationSchema),
  asyncHandler(verifyEmail)
);
router.post(
  '/email-verification/resend',
  authIpRateLimiter,
  validate(resendEmailVerificationSchema),
  authEmailRateLimiter,
  asyncHandler(resendEmailVerification)
);
router.get('/profile', requireAuth, asyncHandler(getCurrentProfile));

export default router;
