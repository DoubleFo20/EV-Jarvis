import type { AuthPrincipal, SystemRole } from '../../types/auth';

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  expiresAt?: number;
  tokenType: 'bearer';
}

export interface RegistrationResult {
  userId: string;
  email: string;
  verificationRequired: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  role: SystemRole;
  isActive: boolean;
  fullName: string | null;
  phoneNumber: string | null;
}

export type { AuthPrincipal };
