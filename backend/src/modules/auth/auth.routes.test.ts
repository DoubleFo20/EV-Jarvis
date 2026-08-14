import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppError } from '../../utils/app-error';

const { authService } = vi.hoisted(() => ({
  authService: {
    authenticate: vi.fn(),
    getProfile: vi.fn(),
    login: vi.fn(),
    logout: vi.fn(),
    refresh: vi.fn(),
    register: vi.fn(),
    resendEmailVerification: vi.fn(),
    verifyEmail: vi.fn(),
  },
}));

vi.mock('./auth.service', () => ({ authService }));
vi.mock('../../lib/prisma', () => ({
  checkDatabaseConnection: vi.fn(),
}));

import app from '../../app';

const principal = {
  id: 'c8ac90fd-7915-45e7-b6aa-7c4ec1505e58',
  email: 'user@example.com',
  role: 'user' as const,
};

describe('authentication routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authService.authenticate.mockResolvedValue(principal);
  });

  it('registers an email/password user with required consent', async () => {
    authService.register.mockResolvedValue({
      userId: principal.id,
      email: principal.email,
      verificationRequired: true,
    });

    const response = await request(app).post('/api/v1/auth/register').send({
      email: 'USER@example.com',
      password: 'Strong!123',
      fullName: 'EV User',
      termsConsent: true,
    });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      success: true,
      data: { verificationRequired: true },
    });
    expect(authService.register).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'Strong!123',
      fullName: 'EV User',
      termsConsent: true,
    });
  });

  it('rejects a weak password before calling Supabase', async () => {
    const response = await request(app).post('/api/v1/auth/register').send({
      email: 'user@example.com',
      password: 'weak',
      fullName: 'EV User',
      termsConsent: true,
    });

    expect(response.status).toBe(400);
    expect(response.body.code).toBe('VALIDATION_ERROR');
    expect(authService.register).not.toHaveBeenCalled();
  });

  it('returns a session from login without logging credentials', async () => {
    authService.login.mockResolvedValue({
      accessToken: 'access',
      refreshToken: 'refresh',
      expiresIn: 3600,
      tokenType: 'bearer',
    });

    const response = await request(app).post('/api/v1/auth/login').send({
      email: 'user@example.com',
      password: 'Strong!123',
    });

    expect(response.status).toBe(200);
    expect(response.body.data).toMatchObject({ accessToken: 'access', refreshToken: 'refresh' });
  });

  it('refreshes a session through the documented endpoint', async () => {
    authService.refresh.mockResolvedValue({
      accessToken: 'new-access',
      refreshToken: 'new-refresh',
      expiresIn: 3600,
      tokenType: 'bearer',
    });

    const response = await request(app)
      .post('/api/v1/auth/refresh')
      .send({ refreshToken: 'refresh' });

    expect(response.status).toBe(200);
    expect(authService.refresh).toHaveBeenCalledWith('refresh');
  });

  it('verifies and resends email verification without exposing tokens', async () => {
    const verification = await request(app)
      .post('/api/v1/auth/email-verification')
      .send({ tokenHash: 'opaque-token-hash' });
    const resend = await request(app)
      .post('/api/v1/auth/email-verification/resend')
      .send({ email: 'user@example.com' });

    expect(verification.status).toBe(200);
    expect(verification.body.data).toEqual({ verified: true });
    expect(resend.status).toBe(202);
    expect(resend.body.data).toEqual({ accepted: true });
  });

  it('revokes the current session on logout', async () => {
    const response = await request(app)
      .post('/api/v1/auth/logout')
      .set('Authorization', 'Bearer access-token');

    expect(response.status).toBe(204);
    expect(authService.authenticate).toHaveBeenCalledWith('Bearer access-token');
    expect(authService.logout).toHaveBeenCalledWith('Bearer access-token');
  });

  it('returns the current active profile', async () => {
    authService.getProfile.mockResolvedValue({
      ...principal,
      isActive: true,
      fullName: 'EV User',
      phoneNumber: null,
    });

    const response = await request(app)
      .get('/api/v1/auth/profile')
      .set('Authorization', 'Bearer access-token');

    expect(response.status).toBe(200);
    expect(response.body.data).toMatchObject({ id: principal.id, role: 'user' });
    expect(authService.getProfile).toHaveBeenCalledWith(principal.id);
  });

  it('rejects protected routes when access-token verification fails', async () => {
    authService.authenticate.mockRejectedValue(
      new AppError(401, 'INVALID_ACCESS_TOKEN', 'Access token is invalid or expired')
    );

    const response = await request(app)
      .get('/api/v1/auth/profile')
      .set('Authorization', 'Bearer invalid');

    expect(response.status).toBe(401);
    expect(response.body.code).toBe('INVALID_ACCESS_TOKEN');
    expect(authService.getProfile).not.toHaveBeenCalled();
  });
});
