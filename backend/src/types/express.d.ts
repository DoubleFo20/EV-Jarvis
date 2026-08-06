import type { AuthPrincipal } from './auth';

declare global {
  namespace Express {
    interface Request {
      user?: AuthPrincipal;
      requestId: string;
    }
  }
}

export {};
