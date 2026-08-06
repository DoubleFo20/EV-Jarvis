import type { AuthPrincipal } from '../types/auth';
import { verifyAccessToken } from '../utils/jwt';

export interface AuthRepository {
  verifyToken(token: string): Promise<AuthPrincipal>;
}

export class SupabaseAuthRepository implements AuthRepository {
  public verifyToken(token: string): Promise<AuthPrincipal> {
    return verifyAccessToken(token);
  }
}

export const authRepository = new SupabaseAuthRepository();
