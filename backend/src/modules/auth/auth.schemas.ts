import { z } from 'zod';

const email = z.string().trim().toLowerCase().email().max(320);
const password = z
  .string()
  .min(8)
  .max(128)
  .regex(/[a-z]/)
  .regex(/[A-Z]/)
  .regex(/[0-9]/)
  .regex(/[^A-Za-z0-9]/);

export const registerSchema = z.object({
  email,
  password,
  fullName: z.string().trim().min(1).max(100),
  termsConsent: z.literal(true),
});

export const loginSchema = z.object({
  email,
  password: z.string().min(1).max(128),
});

export const refreshSessionSchema = z.object({
  refreshToken: z.string().min(1).max(4096),
});

export const emailVerificationSchema = z.object({
  tokenHash: z.string().min(1).max(4096),
});

export const resendEmailVerificationSchema = z.object({ email });

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
