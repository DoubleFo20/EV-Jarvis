import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { isProtectedPath } from "@/shared/lib/auth/routes";
import { getPublicSupabaseConfig } from "@/shared/lib/env";

const copySessionResponse = (
  source: NextResponse,
  destination: NextResponse,
): NextResponse => {
  source.cookies.getAll().forEach((cookie) => destination.cookies.set(cookie));
  for (const name of ["cache-control", "expires", "pragma"]) {
    const value = source.headers.get(name);
    if (value) destination.headers.set(name, value);
  }
  return destination;
};

export const refreshSession = async (request: NextRequest) => {
  let response = NextResponse.next({ request });
  const { url, publishableKey } = getPublicSupabaseConfig();
  const supabase = createServerClient(url, publishableKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet, headers) => {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
        Object.entries(headers).forEach(([name, value]) => {
          response.headers.set(name, value);
        });
      },
    },
  });

  const { data, error } = await supabase.auth.getClaims();

  if (
    isProtectedPath(request.nextUrl.pathname) &&
    (error || typeof data?.claims?.sub !== "string")
  ) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.search = "";
    loginUrl.searchParams.set("error", "session_required");
    loginUrl.searchParams.set(
      "next",
      `${request.nextUrl.pathname}${request.nextUrl.search}`,
    );
    return copySessionResponse(response, NextResponse.redirect(loginUrl));
  }

  if (isProtectedPath(request.nextUrl.pathname)) {
    response.headers.set(
      "Cache-Control",
      "private, no-cache, no-store, must-revalidate, max-age=0",
    );
  }

  return response;
};
