export const safeNextPath = (
  value: string | null | undefined,
  fallback = "/dashboard",
): string => {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }

  try {
    const url = new URL(value, "https://ev-jarvis.local");
    return url.origin === "https://ev-jarvis.local"
      ? `${url.pathname}${url.search}${url.hash}`
      : fallback;
  } catch {
    return fallback;
  }
};
