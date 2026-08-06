import bcrypt from 'bcryptjs';
import { env } from '../config/env';

export const hashPassword = (password: string): Promise<string> =>
  bcrypt.hash(password, env.BCRYPT_ROUNDS);

export const verifyPassword = (password: string, passwordHash: string): Promise<boolean> =>
  bcrypt.compare(password, passwordHash);
