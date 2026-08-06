import { authRepository, type AuthRepository } from '../repositories/auth.repository';
import type { AuthPrincipal } from '../types/auth';
import { AppError } from '../utils/app-error';

export class AuthService {
  public constructor(private readonly repository: AuthRepository = authRepository) {}

  public async authenticate(authorizationHeader: string | undefined): Promise<AuthPrincipal> {
    if (!authorizationHeader) {
      throw new AppError(401, 'AUTHORIZATION_REQUIRED', 'Authorization header is required');
    }

    const [scheme, token, extra] = authorizationHeader.trim().split(/\s+/);

    if (scheme?.toLowerCase() !== 'bearer' || !token || extra) {
      throw new AppError(401, 'INVALID_AUTHORIZATION_HEADER', 'A Bearer access token is required');
    }

    return this.repository.verifyToken(token);
  }
}

export const authService = new AuthService();
