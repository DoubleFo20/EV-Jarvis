import { Request, Response } from 'express';
import { env } from '../config/env';

export const checkHealth = (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    version: '1.0.0',
    environment: env.NODE_ENV,
  });
};
