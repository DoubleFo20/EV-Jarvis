import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env';

const serverAuthOptions = {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
} as const;

export const createSupabaseAuthClient = () =>
  createClient(env.SUPABASE_URL, env.SUPABASE_PUBLISHABLE_KEY, serverAuthOptions);

export const supabase = createSupabaseAuthClient();

export const supabaseAdmin = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SECRET_KEY,
  serverAuthOptions
);
