import type { Session } from '@supabase/supabase-js';
import { prisma } from '../../lib/prisma';
import {
  createSupabaseAuthClient,
  supabaseAdmin,
} from '../../lib/supabase';
import { verifyAccessToken } from '../../utils/jwt';
import type { AuthPrincipal } from '../../types/auth';
import type { LoginInput, RegisterInput } from './auth.schemas';
import type { AuthSession, RegistrationResult, UserProfile } from './auth.types';

export interface ProviderFailure {
  code?: string;
  status?: number;
}

export class AuthProviderError extends Error {
  public constructor(public readonly failure: ProviderFailure) {
    super('Authentication provider request failed');
    this.name = 'AuthProviderError';
  }
}

const toSession = (session: Session): AuthSession => ({
  accessToken: session.access_token,
  refreshToken: session.refresh_token,
  expiresIn: session.expires_in,
  expiresAt: session.expires_at,
  tokenType: session.token_type,
});

export interface AuthRepository {
  verifyToken(token: string): Promise<AuthPrincipal>;
  register(input: RegisterInput): Promise<RegistrationResult>;
  login(input: LoginInput): Promise<AuthSession>;
  logout(accessToken: string): Promise<void>;
  refresh(refreshToken: string): Promise<AuthSession>;
  verifyEmail(tokenHash: string): Promise<void>;
  resendEmailVerification(email: string): Promise<void>;
  getProfile(userId: string): Promise<UserProfile | null>;
}

export class SupabaseAuthRepository implements AuthRepository {
  public verifyToken(token: string): Promise<AuthPrincipal> {
    return verifyAccessToken(token);
  }

  public async register(input: RegisterInput): Promise<RegistrationResult> {
    const client = createSupabaseAuthClient();
    const { data, error } = await client.auth.signUp({
      email: input.email,
      password: input.password,
      options: { data: { full_name: input.fullName, terms_consent: true } },
    });

    if (error) {
      throw new AuthProviderError({ code: error.code, status: error.status });
    }

    if (!data.user || data.user.identities?.length === 0) {
      throw new AuthProviderError({ code: 'user_already_exists', status: 409 });
    }

    return {
      userId: data.user.id,
      email: data.user.email ?? input.email,
      verificationRequired: data.session === null,
    };
  }

  public async login(input: LoginInput): Promise<AuthSession> {
    const client = createSupabaseAuthClient();
    const { data, error } = await client.auth.signInWithPassword(input);

    if (error || !data.session) {
      throw new AuthProviderError({ code: error?.code, status: error?.status });
    }

    return toSession(data.session);
  }

  public async logout(accessToken: string): Promise<void> {
    const { error } = await supabaseAdmin.auth.admin.signOut(accessToken, 'local');

    if (error) {
      throw new AuthProviderError({ code: error.code, status: error.status });
    }
  }

  public async refresh(refreshToken: string): Promise<AuthSession> {
    const client = createSupabaseAuthClient();
    const { data, error } = await client.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error || !data.session) {
      throw new AuthProviderError({ code: error?.code, status: error?.status });
    }

    return toSession(data.session);
  }

  public async verifyEmail(tokenHash: string): Promise<void> {
    const client = createSupabaseAuthClient();
    const { error } = await client.auth.verifyOtp({
      token_hash: tokenHash,
      type: 'email',
    });

    if (error) {
      throw new AuthProviderError({ code: error.code, status: error.status });
    }
  }

  public async resendEmailVerification(email: string): Promise<void> {
    const client = createSupabaseAuthClient();
    const { error } = await client.auth.resend({ type: 'signup', email });

    if (error) {
      throw new AuthProviderError({ code: error.code, status: error.status });
    }
  }

  public async getProfile(userId: string): Promise<UserProfile | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      fullName: user.profile?.fullName ?? null,
      phoneNumber: user.profile?.phoneNumber ?? null,
    };
  }
}

export const authRepository = new SupabaseAuthRepository();
