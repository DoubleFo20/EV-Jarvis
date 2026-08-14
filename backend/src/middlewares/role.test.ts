import type { NextFunction, Request, Response } from 'express';
import { describe, expect, it, vi } from 'vitest';
import { AppError } from '../utils/app-error';
import { requireRole } from './role';

const makeRequest = (role?: 'user' | 'admin'): Request =>
  ({
    user: role
      ? {
          id: 'c8ac90fd-7915-45e7-b6aa-7c4ec1505e58',
          role,
        }
      : undefined,
  }) as Request;

describe('requireRole', () => {
  it('rejects requests without an authenticated principal', () => {
    const next = vi.fn() as NextFunction;

    requireRole('user')(makeRequest(), {} as Response, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect(next.mock.calls[0]?.[0]).toMatchObject({ statusCode: 401 });
  });

  it('allows a user through a user endpoint', () => {
    const next = vi.fn() as NextFunction;

    requireRole('user', 'admin')(makeRequest('user'), {} as Response, next);

    expect(next).toHaveBeenCalledWith();
  });

  it('denies a user access to an admin-only endpoint', () => {
    const next = vi.fn() as NextFunction;

    requireRole('admin')(makeRequest('user'), {} as Response, next);

    expect(next.mock.calls[0]?.[0]).toMatchObject({
      statusCode: 403,
      code: 'INSUFFICIENT_ROLE',
    });
  });

  it('allows an admin through an admin-only endpoint', () => {
    const next = vi.fn() as NextFunction;

    requireRole('admin')(makeRequest('admin'), {} as Response, next);

    expect(next).toHaveBeenCalledWith();
  });
});
