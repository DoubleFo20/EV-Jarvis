const requireEnv = (name: string): string => {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

export const getPublicSupabaseConfig = () => ({
  url: requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
  publishableKey: requireEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"),
});

export const getSiteUrl = (): string =>
  requireEnv("NEXT_PUBLIC_SITE_URL").replace(/\/$/, "");
