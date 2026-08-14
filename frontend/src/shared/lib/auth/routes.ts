export const isProtectedPath = (pathname: string): boolean =>
  pathname === "/dashboard" ||
  pathname.startsWith("/dashboard/") ||
  pathname === "/profile" ||
  pathname.startsWith("/profile/");
