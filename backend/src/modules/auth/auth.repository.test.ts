import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
  createSupabaseAuthClient,
  getProfile,
  signInWithPassword,
  signOut,
  signUp,
  verifyAccessToken,
} = vi.hoisted(() => ({
  createSupabaseAuthClient: vi.fn(),
  getProfile: vi.fn(),
  signInWithPassword: vi.fn(),
  signOut: vi.fn(),
  signUp: vi.fn(),
  verifyAccessToken: vi.fn(),
}));

vi.mock('../../lib/supabase', () => ({
  createSupabaseAuthClient,
  supabaseAdmin: { auth: { admin: { signOut } } },
}));
vi.mock('../../lib/prisma', () => ({
  prisma: { user: { findUnique: getProfile } },
}));
vi.mock('../../utils/jwt', () => ({ verifyAccessToken }));

import { AuthProviderError, SupabaseAuthRepository } from './auth.repository';

describe('SupabaseAuthRepository', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    createSupabaseAuthClient.mockReturnValue({
      auth: {
        signUp,
        signInWithPassword,
        refreshSession: vi.fn(),
        verifyOtp: vi.fn(),
        resend: vi.fn(),
      },
    });
  });

  it('registers with user metadata and requires email verification', async () => {
    signUp.mockResolvedValue({
      data: {
        user: {
          id: 'c8ac90fd-7915-45e7-b6aa-7c4ec1505e58',
          email: 'user@example.com',
          identities: [{}],
        },
        session: null,
      },
      error: null,
    });
    const repository = new SupabaseAuthRepository();

    await expect(
      repository.register({
        email: 'user@example.com',
        password: 'Strong!123',
        fullName: 'EV User',
        termsConsent: true,
      })
    ).resolves.toMatchObject({ verificationRequired: true });
    expect(signUp).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'Strong!123',
      options: { data: { full_name: 'EV User', terms_consent: true } },
    });
  });

  it('treats an obfuscated duplicate sign-up as an existing account', async () => {
    signUp.mockResolvedValue({
      data: {
        user: {
          id: 'c8ac90fd-7915-45e7-b6aa-7c4ec1505e58',
          email: 'user@example.com',
          identities: [],
        },
        session: null,
      },
      error: null,
    });
    const repository = new SupabaseAuthRepository();

    await expect(
      repository.register({
        email: 'user@example.com',
        password: 'Strong!123',
        fullName: 'EV User',
        termsConsent: true,
      })
    ).rejects.toBeInstanceOf(AuthProviderError);
  });

  it('returns only the documented session fields on login', async () => {
    signInWithPassword.mockResolvedValue({
      data: {
        session: {
          access_token: 'access',
          refresh_token: 'refresh',
          expires_in: 3600,
          expires_at: 12345,
          token_type: 'bearer',
        },
      },
      error: null,
    });
    const repository = new SupabaseAuthRepository();

    await expect(
      repository.login({ email: 'user@example.com', password: 'Strong!123' })
    ).resolves.toEqual({
      accessToken: 'access',
      refreshToken: 'refresh',
      expiresIn: 3600,
      expiresAt: 12345,
      tokenType: 'bearer',
    });
  });

  it('revokes only the current Supabase session', async () => {
    signOut.mockResolvedValue({ data: null, error: null });
    const repository = new SupabaseAuthRepository();

    await repository.logout('access-token');

    expect(signOut).toHaveBeenCalledWith('access-token', 'local');
  });

  it('reads the current user and profile without returning internal fields', async () => {
    getProfile.mockResolvedValue({
      id: 'c8ac90fd-7915-45e7-b6aa-7c4ec1505e58',
      email: 'user@example.com',
      role: 'user',
      isActive: true,
      profile: { fullName: 'EV User', phoneNumber: null },
    });
    const repository = new SupabaseAuthRepository();

    await expect(
      repository.getProfile('c8ac90fd-7915-45e7-b6aa-7c4ec1505e58')
    ).resolves.toEqual({
      id: 'c8ac90fd-7915-45e7-b6aa-7c4ec1505e58',
      email: 'user@example.com',
      role: 'user',
      isActive: true,
      fullName: 'EV User',
      phoneNumber: null,
    });
  });
});
