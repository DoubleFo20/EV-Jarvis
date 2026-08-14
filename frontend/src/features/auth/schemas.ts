import { z } from "zod";

export const loginSchema = z.object({
  email: z.email().max(320),
  password: z.string().min(1).max(128),
  next: z.string().optional(),
});

export const registerSchema = z.object({
  fullName: z.string().trim().min(1).max(100),
  email: z.email().max(320),
  password: z
    .string()
    .min(8)
    .max(128)
    .regex(/[a-z]/)
    .regex(/[A-Z]/)
    .regex(/[0-9]/)
    .regex(/[^A-Za-z0-9]/),
  terms: z.literal("on"),
});
