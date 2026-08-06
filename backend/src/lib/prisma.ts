import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';
import { env } from '../config/env';
import { logger } from '../config/logger';

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });

export const prisma = new PrismaClient({ adapter });

export const connectDatabase = async (): Promise<void> => {
  await prisma.$connect();
  logger.info('Database connection established');
};

export const disconnectDatabase = async (): Promise<void> => {
  await prisma.$disconnect();
};

export const checkDatabaseConnection = async (): Promise<boolean> => {
  await prisma.$queryRaw`SELECT 1`;
  return true;
};
