import type { Request, Response } from 'express';
import { env } from '../config/env';
import { checkDatabaseConnection } from '../lib/prisma';

export const checkRoot = (_req: Request, res: Response): void => {
  res.status(200).json({
    service: 'EV-JARVIS API',
    version: '1.0.0',
    environment: env.NODE_ENV,
  });
};

export const checkHealth = (_req: Request, res: Response): void => {
  res.status(200).json({
    status: 'ok',
    version: '1.0.0',
    environment: env.NODE_ENV,
  });
};

export const checkDatabaseHealth = async (_req: Request, res: Response): Promise<void> => {
  try {
    await checkDatabaseConnection();
    res.status(200).json({ status: 'ok', database: 'connected' });
  } catch {
    res.status(503).json({ status: 'unavailable', database: 'disconnected' });
  }
};
