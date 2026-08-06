import { z } from 'zod';
import { supabase } from '../lib/supabase';
import { systemRoles, type AuthPrincipal, type SystemRole } from '../types/auth';
import { AppError } from './app-error';

const claimsSchema = z.object({
  sub: z.string().uuid(),
  email: z.string().email().optional(),
  app_metadata: z.record(z.string(), z.unknown()).optional(),
});

const isSystemRole = (value: unknown): value is SystemRole =>
  typeof value === 'string' && systemRoles.includes(value as SystemRole);

export const verifyAccessToken = async (token: string): Promise<AuthPrincipal> => {
  const { data, error } = await supabase.auth.getClaims(token);

  if (error || !data?.claims) {
    throw new AppError(401, 'INVALID_ACCESS_TOKEN', 'Access token is invalid or expired');
  }

  const parsedClaims = claimsSchema.safeParse(data.claims);

  if (!parsedClaims.success) {
    throw new AppError(401, 'INVALID_ACCESS_TOKEN', 'Access token claims are invalid');
  }

  const claimedRole = parsedClaims.data.app_metadata?.role;

  return {
    id: parsedClaims.data.sub,
    email: parsedClaims.data.email,
    role: isSystemRole(claimedRole) ? claimedRole : 'user',
  };
};
