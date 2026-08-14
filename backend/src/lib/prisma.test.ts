import { beforeEach, describe, expect, it, vi } from 'vitest';

const { PrismaClient, PrismaPg, prismaInstances } = vi.hoisted(() => {
  const prismaInstances: object[] = [];

  class MockPrismaClient {
    constructor() {
      prismaInstances.push(this);
    }
  }

  return {
    PrismaClient: MockPrismaClient,
    PrismaPg: vi.fn(),
    prismaInstances,
  };
});

vi.mock('@prisma/adapter-pg', () => ({ PrismaPg }));
vi.mock('../generated/prisma/client', () => ({ PrismaClient }));
vi.mock('../config/env', () => ({
  env: {
    DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
    NODE_ENV: 'development',
  },
}));
vi.mock('../config/logger', () => ({ logger: { info: vi.fn() } }));

describe('Prisma client', () => {
  beforeEach(() => {
    delete (globalThis as typeof globalThis & { prisma?: unknown }).prisma;
    prismaInstances.length = 0;
    vi.resetModules();
  });

  it('reuses one client when the module reloads during development', async () => {
    const firstModule = await import('./prisma');
    vi.resetModules();
    const secondModule = await import('./prisma');

    expect(secondModule.prisma).toBe(firstModule.prisma);
    expect(prismaInstances).toHaveLength(1);
  });
});
