import type { Request, Response } from 'express';
import { authService } from './auth.service';

const sendSuccess = (req: Request, res: Response, status: number, data: unknown): void => {
  res.status(status).json({
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      request_id: req.requestId,
    },
  });
};

export const register = async (req: Request, res: Response): Promise<void> => {
  sendSuccess(req, res, 201, await authService.register(req.body));
};

export const login = async (req: Request, res: Response): Promise<void> => {
  sendSuccess(req, res, 200, await authService.login(req.body));
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  await authService.logout(req.headers.authorization);
  res.status(204).send();
};

export const refreshSession = async (req: Request, res: Response): Promise<void> => {
  sendSuccess(req, res, 200, await authService.refresh(req.body.refreshToken));
};

export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  await authService.verifyEmail(req.body.tokenHash);
  sendSuccess(req, res, 200, { verified: true });
};

export const resendEmailVerification = async (req: Request, res: Response): Promise<void> => {
  await authService.resendEmailVerification(req.body.email);
  sendSuccess(req, res, 202, { accepted: true });
};

export const getCurrentProfile = async (req: Request, res: Response): Promise<void> => {
  sendSuccess(req, res, 200, await authService.getProfile(req.user!.id));
};
