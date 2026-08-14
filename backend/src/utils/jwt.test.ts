import { beforeEach, describe, expect, it, vi } from 'vitest';

const { getClaims } = vi.hoisted(() => ({ getClaims: vi.fn() }));

vi.mock('../lib/supabase', () => ({
  supabase: { auth: { getClaims } },
}));

import { verifyAccessToken } from './jwt';

describe('verifyAccessToken', () => {
  beforeEach(() => vi.clearAllMocks());

  it('accepts JWKS-verified authenticated claims and defaults to user', async () => {
    getClaims.mockResolvedValue({
      data: {
        claims: {
          sub: 'c8ac90fd-7915-45e7-b6aa-7c4ec1505e58',
          email: 'user@example.com',
          aud: 'authenticated',
          app_metadata: {},
        },
      },
      error: null,
    });

    await expect(verifyAccessToken('token')).resolves.toEqual({
      id: 'c8ac90fd-7915-45e7-b6aa-7c4ec1505e58',
      email: 'user@example.com',
      role: 'user',
    });
    expect(getClaims).toHaveBeenCalledWith('token');
  });

  it('accepts only an approved admin role from app metadata', async () => {
    getClaims.mockResolvedValue({
      data: {
        claims: {
          sub: 'c8ac90fd-7915-45e7-b6aa-7c4ec1505e58',
          aud: ['authenticated'],
          app_metadata: { role: 'admin' },
        },
      },
      error: null,
    });

    await expect(verifyAccessToken('token')).resolves.toMatchObject({ role: 'admin' });
  });

  it('does not grant an unsupported super_admin claim', async () => {
    getClaims.mockResolvedValue({
      data: {
        claims: {
          sub: 'c8ac90fd-7915-45e7-b6aa-7c4ec1505e58',
          aud: 'authenticated',
          app_metadata: { role: 'super_admin' },
        },
      },
      error: null,
    });

    await expect(verifyAccessToken('token')).resolves.toMatchObject({ role: 'user' });
  });

  it.each([
    { data: null, error: new Error('invalid') },
    { data: { claims: { sub: 'not-a-uuid', aud: 'authenticated' } }, error: null },
    {
      data: {
        claims: {
          sub: 'c8ac90fd-7915-45e7-b6aa-7c4ec1505e58',
          aud: ['other'],
        },
      },
      error: null,
    },
  ])('rejects invalid or untrusted claims', async (result) => {
    getClaims.mockResolvedValue(result);
    await expect(verifyAccessToken('token')).rejects.toMatchObject({ statusCode: 401 });
  });
});
