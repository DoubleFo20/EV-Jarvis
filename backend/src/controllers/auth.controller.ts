import type { Request, Response } from 'express';

export class AuthController {
  public getCurrentPrincipal(req: Request, res: Response): void {
    res.status(200).json({ data: req.user });
  }
}

export const authController = new AuthController();
