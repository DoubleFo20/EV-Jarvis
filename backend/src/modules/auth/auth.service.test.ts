import { describe, expect, it, vi } from 'vitest';
import { AppError } from '../../utils/app-error';
import {
  AuthProviderError,
  type AuthRepository,
} from './auth.repository';
import { AuthService } from './auth.service';

const principal = {
  id: 'c8ac90fd-7915-45e7-b6aa-7c4ec1505e58',
  email: 'user@example.com',
  role: 'user' as const,
};

const profile = {
  ...principal,
  email: 'user@example.com',
  isActive: true,
  fullName: 'EV User',
  phoneNumber: null,
};

const makeRepository = (overrides: Partial<AuthRepository> = {}): AuthRepository => ({
  verifyToken: vi.fn().mockResolvedValue(principal),
  register: vi.fn(),
  login: vi.fn(),
  logout: vi.fn(),
  refresh: vi.fn(),
  verifyEmail: vi.fn(),
  resendEmailVerification: vi.fn(),
  getProfile: vi.fn(),
  ...overrides,
});

describe('AuthService', () => {
  it('delegates a valid Bearer token to JWKS verification', async () => {
    const repository = makeRepository();
    const service = new AuthService(repository);

    await expect(service.authenticate('Bearer access-token')).resolves.toEqual(principal);
    expect(repository.verifyToken).toHaveBeenCalledWith('access-token');
  });

  it.each([undefined, '', 'Basic value', 'Bearer', 'Bearer one two'])(
    'rejects an invalid authorization header: %s',
    async (header) => {
      const service = new AuthService(makeRepository());
      await expect(service.authenticate(header)).rejects.toBeInstanceOf(AppError);
    }
  );

  it('maps duplicate registration without exposing provider details', async () => {
    const service = new AuthService(
      makeRepository({
        register: vi.fn().mockRejectedValue(
          new AuthProviderError({ code: 'user_already_exists', status: 422 })
        ),
      })
    );

    await expect(
      service.register({
        email: 'user@example.com',
        password: 'Strong!123',
        fullName: 'EV User',
        termsConsent: true,
      })
    ).rejects.toMatchObject({ statusCode: 409, code: 'EMAIL_ALREADY_EXISTS' });
  });

  it('maps a provider-rejected email to a validation response', async () => {
    const service = new AuthService(
      makeRepository({
        register: vi.fn().mockRejectedValue(
          new AuthProviderError({ code: 'email_address_invalid', status: 400 })
        ),
      })
    );

    await expect(
      service.register({
        email: 'user@example.com',
        password: 'Strong!123',
        fullName: 'EV User',
        termsConsent: true,
      })
    ).rejects.toMatchObject({ statusCode: 400, code: 'INVALID_EMAIL' });
  });

  it('preserves the provider email rate-limit response', async () => {
    const service = new AuthService(
      makeRepository({
        register: vi.fn().mockRejectedValue(
          new AuthProviderError({ code: 'over_email_send_rate_limit', status: 429 })
        ),
      })
    );

    await expect(
      service.register({
        email: 'user@example.com',
        password: 'Strong!123',
        fullName: 'EV User',
        termsConsent: true,
      })
    ).rejects.toMatchObject({ statusCode: 429, code: 'EMAIL_RATE_LIMITED' });
  });

  it('maps unverified login to a forbidden response', async () => {
    const service = new AuthService(
      makeRepository({
        login: vi.fn().mockRejectedValue(
          new AuthProviderError({ code: 'email_not_confirmed', status: 400 })
        ),
      })
    );

    await expect(
      service.login({ email: 'user@example.com', password: 'Strong!123' })
    ).rejects.toMatchObject({ statusCode: 403, code: 'EMAIL_NOT_VERIFIED' });
  });

  it('maps invalid credentials to an unauthorized response', async () => {
    const service = new AuthService(
      makeRepository({
        login: vi.fn().mockRejectedValue(
          new AuthProviderError({ code: 'invalid_credentials', status: 400 })
        ),
      })
    );

    await expect(
      service.login({ email: 'user@example.com', password: 'wrong' })
    ).rejects.toMatchObject({ statusCode: 401, code: 'INVALID_CREDENTIALS' });
  });

  it('verifies the access token before revoking the current session', async () => {
    const repository = makeRepository();
    const service = new AuthService(repository);

    await service.logout('Bearer access-token');

    expect(repository.verifyToken).toHaveBeenCalledWith('access-token');
    expect(repository.logout).toHaveBeenCalledWith('access-token');
  });

  it('rejects an expired refresh token', async () => {
    const service = new AuthService(
      makeRepository({
        refresh: vi.fn().mockRejectedValue(new AuthProviderError({ status: 401 })),
      })
    );

    await expect(service.refresh('expired')).rejects.toMatchObject({
      statusCode: 401,
      code: 'INVALID_REFRESH_TOKEN',
    });
  });

  it('returns an active user profile', async () => {
    const service = new AuthService(
      makeRepository({ getProfile: vi.fn().mockResolvedValue(profile) })
    );

    await expect(service.getProfile(principal.id)).resolves.toEqual(profile);
  });

  it('denies access to a disabled account', async () => {
    const service = new AuthService(
      makeRepository({
        getProfile: vi.fn().mockResolvedValue({ ...profile, isActive: false }),
      })
    );

    await expect(service.getProfile(principal.id)).rejects.toMatchObject({
      statusCode: 403,
      code: 'ACCOUNT_DISABLED',
    });
  });
});
