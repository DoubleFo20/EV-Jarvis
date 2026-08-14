import { redirect } from "next/navigation";

import { createClient } from "@/shared/lib/supabase/server";

export type AuthClaims = {
  sub: string;
  email?: string;
  app_metadata?: { role?: "user" | "admin" };
};

export const getVerifiedClaims = async (): Promise<AuthClaims | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || typeof data?.claims?.sub !== "string") {
    return null;
  }

  return data.claims as AuthClaims;
};

export const requireVerifiedClaims = async (): Promise<AuthClaims> => {
  const claims = await getVerifiedClaims();

  if (!claims) {
    redirect("/login?error=session_required");
  }

  return claims;
};
