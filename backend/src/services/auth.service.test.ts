import { describe, expect, it, vi } from 'vitest';
import type { AuthRepository } from '../repositories/auth.repository';
import { AppError } from '../utils/app-error';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  const principal = {
    id: 'c8ac90fd-7915-45e7-b6aa-7c4ec1505e58',
    email: 'user@example.com',
    role: 'user' as const,
  };

  it('delegates a Bearer token to the repository', async () => {
    const verifyToken = vi.fn().mockResolvedValue(principal);
    const repository: AuthRepository = { verifyToken };
    const service = new AuthService(repository);

    await expect(service.authenticate('Bearer access-token')).resolves.toEqual(principal);
    expect(verifyToken).toHaveBeenCalledWith('access-token');
  });

  it.each([undefined, '', 'Basic value', 'Bearer', 'Bearer one two'])(
    'rejects an invalid authorization header: %s',
    async (header) => {
      const repository: AuthRepository = { verifyToken: vi.fn() };
      const service = new AuthService(repository);

      await expect(service.authenticate(header)).rejects.toBeInstanceOf(AppError);
    }
  );
});
