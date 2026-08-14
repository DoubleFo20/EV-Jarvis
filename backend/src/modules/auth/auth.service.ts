import { logger } from '../../config/logger';
import type { AuthPrincipal } from '../../types/auth';
import { AppError } from '../../utils/app-error';
import type { LoginInput, RegisterInput } from './auth.schemas';
import {
  AuthProviderError,
  authRepository,
  type AuthRepository,
} from './auth.repository';
import type { AuthSession, RegistrationResult, UserProfile } from './auth.types';

const providerCode = (error: unknown): string | undefined =>
  error instanceof AuthProviderError ? error.failure.code : undefined;

const providerStatus = (error: unknown): number | undefined =>
  error instanceof AuthProviderError ? error.failure.status : undefined;

export class AuthService {
  public constructor(private readonly repository: AuthRepository = authRepository) {}

  public async register(input: RegisterInput): Promise<RegistrationResult> {
    try {
      const result = await this.repository.register(input);
      this.logSecurityEvent('AUTH_REGISTERED', 'FEAT-001', result.userId);
      return result;
    } catch (error) {
      if (providerCode(error) === 'user_already_exists' || providerStatus(error) === 409) {
        throw new AppError(409, 'EMAIL_ALREADY_EXISTS', 'An account already exists for this email');
      }

      if (providerCode(error) === 'email_address_invalid') {
        throw new AppError(400, 'INVALID_EMAIL', 'A valid email address is required');
      }

      if (providerStatus(error) === 429) {
        throw new AppError(429, 'EMAIL_RATE_LIMITED', 'Please wait before requesting another email');
      }

      this.logProviderFailure('registration', error);
      throw new AppError(503, 'EMAIL_PROVIDER_UNAVAILABLE', 'Registration is temporarily unavailable');
    }
  }

  public async login(input: LoginInput): Promise<AuthSession> {
    try {
      const session = await this.repository.login(input);
      const principal = await this.repository.verifyToken(session.accessToken);
      this.logSecurityEvent('AUTH_LOGIN_SUCCEEDED', 'FEAT-002', principal.id);
      return session;
    } catch (error) {
      if (providerCode(error) === 'email_not_confirmed') {
        throw new AppError(403, 'EMAIL_NOT_VERIFIED', 'Email verification is required');
      }

      if (providerStatus(error) === 400 || providerCode(error) === 'invalid_credentials') {
        throw new AppError(401, 'INVALID_CREDENTIALS', 'Email or password is invalid');
      }

      this.logProviderFailure('login', error);
      throw new AppError(503, 'AUTH_PROVIDER_UNAVAILABLE', 'Authentication is temporarily unavailable');
    }
  }

  public async logout(authorizationHeader: string | undefined): Promise<void> {
    const token = this.parseBearerToken(authorizationHeader);
    const principal = await this.repository.verifyToken(token);

    try {
      await this.repository.logout(token);
      this.logSecurityEvent('AUTH_LOGOUT_SUCCEEDED', 'FEAT-002', principal.id);
    } catch (error) {
      this.logProviderFailure('logout', error);
      throw new AppError(503, 'AUTH_PROVIDER_UNAVAILABLE', 'Logout is temporarily unavailable');
    }
  }

  public async refresh(refreshToken: string): Promise<AuthSession> {
    try {
      const session = await this.repository.refresh(refreshToken);
      const principal = await this.repository.verifyToken(session.accessToken);
      this.logSecurityEvent('AUTH_SESSION_REFRESHED', 'FEAT-002', principal.id);
      return session;
    } catch (error) {
      if (
        providerStatus(error) === 400 ||
        providerStatus(error) === 401 ||
        providerStatus(error) === 403
      ) {
        throw new AppError(401, 'INVALID_REFRESH_TOKEN', 'Refresh token is invalid or expired');
      }

      this.logProviderFailure('session refresh', error);
      throw new AppError(503, 'AUTH_PROVIDER_UNAVAILABLE', 'Session refresh is temporarily unavailable');
    }
  }

  public async verifyEmail(tokenHash: string): Promise<void> {
    try {
      await this.repository.verifyEmail(tokenHash);
    } catch (error) {
      if (
        providerStatus(error) === 400 ||
        providerStatus(error) === 401 ||
        providerStatus(error) === 403
      ) {
        throw new AppError(400, 'INVALID_VERIFICATION_TOKEN', 'Verification token is invalid or expired');
      }

      this.logProviderFailure('email verification', error);
      throw new AppError(503, 'EMAIL_PROVIDER_UNAVAILABLE', 'Email verification is temporarily unavailable');
    }
  }

  public async resendEmailVerification(email: string): Promise<void> {
    try {
      await this.repository.resendEmailVerification(email);
    } catch (error) {
      this.logProviderFailure('verification resend', error);
      throw new AppError(503, 'EMAIL_PROVIDER_UNAVAILABLE', 'Verification email is temporarily unavailable');
    }
  }

  public async authenticate(authorizationHeader: string | undefined): Promise<AuthPrincipal> {
    return this.repository.verifyToken(this.parseBearerToken(authorizationHeader));
  }

  public async getProfile(userId: string): Promise<UserProfile> {
    const profile = await this.repository.getProfile(userId);

    if (!profile) {
      throw new AppError(404, 'PROFILE_NOT_FOUND', 'User profile was not found');
    }

    if (!profile.isActive) {
      throw new AppError(403, 'ACCOUNT_DISABLED', 'User account is disabled');
    }

    return profile;
  }

  private parseBearerToken(authorizationHeader: string | undefined): string {
    if (!authorizationHeader) {
      throw new AppError(401, 'AUTHORIZATION_REQUIRED', 'Authorization header is required');
    }

    const [scheme, token, extra] = authorizationHeader.trim().split(/\s+/);

    if (scheme?.toLowerCase() !== 'bearer' || !token || extra) {
      throw new AppError(401, 'INVALID_AUTHORIZATION_HEADER', 'A Bearer access token is required');
    }

    return token;
  }

  private logProviderFailure(operation: string, error: unknown): void {
    logger.warn('Authentication provider operation failed', {
      operation,
      providerCode: providerCode(error),
      providerStatus: providerStatus(error),
    });
  }

  private logSecurityEvent(event: string, featureId: string, actorId: string): void {
    logger.info('Authentication security event', {
      event,
      featureId,
      actorId,
      outcome: 'success',
    });
  }
}

export const authService = new AuthService();
