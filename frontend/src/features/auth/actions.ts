"use server";

import { redirect } from "next/navigation";

import { authErrorCode } from "@/features/auth/errors";
import { loginSchema, registerSchema } from "@/features/auth/schemas";
import { safeNextPath } from "@/shared/lib/auth/redirect";
import { getSiteUrl } from "@/shared/lib/env";
import { createClient } from "@/shared/lib/supabase/server";

const formValue = (formData: FormData, name: string): string => {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
};

const redirectWithError = (
  pathname: "/login" | "/register",
  code: string,
  next?: string,
): never => {
  const params = new URLSearchParams({ error: code });
  if (next) params.set("next", safeNextPath(next));
  redirect(`${pathname}?${params.toString()}`);
};

export const loginAction = async (formData: FormData): Promise<void> => {
  const result = loginSchema.safeParse({
    email: formValue(formData, "email"),
    password: formValue(formData, "password"),
    next: formValue(formData, "next") || undefined,
  });

  if (!result.success) return redirectWithError("/login", "invalid_input");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: result.data.email,
    password: result.data.password,
  });

  if (error) {
    redirectWithError("/login", authErrorCode(error), result.data.next);
  }

  redirect(safeNextPath(result.data.next));
};

export const registerAction = async (formData: FormData): Promise<void> => {
  const result = registerSchema.safeParse({
    fullName: formValue(formData, "fullName"),
    email: formValue(formData, "email"),
    password: formValue(formData, "password"),
    terms: formValue(formData, "terms"),
  });

  if (!result.success) return redirectWithError("/register", "invalid_input");

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: result.data.email,
    password: result.data.password,
    options: {
      data: {
        full_name: result.data.fullName,
        terms_consent: true,
      },
      emailRedirectTo: `${getSiteUrl()}/auth/confirm?next=/dashboard`,
    },
  });

  if (error) redirectWithError("/register", authErrorCode(error));

  if (data.session) redirect("/dashboard");
  redirect("/login?notice=check_email");
};

export const logoutAction = async (): Promise<void> => {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) redirect("/dashboard?error=auth_failed");
  redirect("/login?notice=signed_out");
};
