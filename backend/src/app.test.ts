import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { checkDatabaseConnection } = vi.hoisted(() => ({
  checkDatabaseConnection: vi.fn(),
}));

vi.mock('./lib/prisma', () => ({
  checkDatabaseConnection,
}));

import app from './app';

describe('application foundation', () => {
  beforeEach(() => {
    checkDatabaseConnection.mockResolvedValue(true);
  });

  it('returns service metadata from the root endpoint', async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      service: 'EV-JARVIS API',
      version: '1.0.0',
    });
    expect(response.headers['x-request-id']).toBeTypeOf('string');
  });

  it.each(['/health', '/healthz', '/readyz', '/api/v1/health'])(
    'returns a successful health response from %s',
    async (path) => {
      const response = await request(app).get(path);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({ status: 'ok', version: '1.0.0' });
    }
  );

  it('returns database health without exposing connection details', async () => {
    const response = await request(app).get('/health/db');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok', database: 'connected' });
    expect(checkDatabaseConnection).toHaveBeenCalledOnce();
  });

  it('returns service unavailable when the database cannot be reached', async () => {
    checkDatabaseConnection.mockRejectedValueOnce(new Error('connection failed'));

    const response = await request(app).get('/health/db');

    expect(response.status).toBe(503);
    expect(response.body).toEqual({ status: 'unavailable', database: 'disconnected' });
  });

  it('returns an RFC 7807 response for an unknown route', async () => {
    const response = await request(app).get('/missing');

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({
      type: 'about:blank',
      title: 'Not Found',
      status: 404,
      code: 'ROUTE_NOT_FOUND',
      instance: '/missing',
    });
  });
});
