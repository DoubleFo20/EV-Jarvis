import { describe, expect, it, vi } from 'vitest';

const { createClient } = vi.hoisted(() => ({
  createClient: vi.fn(() => ({})),
}));

vi.mock('@supabase/supabase-js', () => ({ createClient }));
vi.mock('../config/env', () => ({
  env: {
    SUPABASE_URL: 'https://project.supabase.co',
    SUPABASE_PUBLISHABLE_KEY: 'test-publishable-key',
    SUPABASE_SECRET_KEY: 'test-secret-key',
  },
}));

import { createSupabaseAuthClient, supabase, supabaseAdmin } from './supabase';

describe('Supabase backend clients', () => {
  const options = {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  };

  it('separates user authentication from privileged admin operations', () => {
    expect(createClient).toHaveBeenNthCalledWith(
      1,
      'https://project.supabase.co',
      'test-publishable-key',
      options
    );
    expect(createClient).toHaveBeenNthCalledWith(
      2,
      'https://project.supabase.co',
      'test-secret-key',
      options
    );
    expect(supabase).toBeDefined();
    expect(supabaseAdmin).toBeDefined();
  });

  it('creates isolated clients for password and refresh-token operations', () => {
    createSupabaseAuthClient();

    expect(createClient).toHaveBeenLastCalledWith(
      'https://project.supabase.co',
      'test-publishable-key',
      options
    );
  });
});
