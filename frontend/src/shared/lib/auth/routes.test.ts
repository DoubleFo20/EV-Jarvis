import { describe, expect, it } from "vitest";

import { isProtectedPath } from "./routes";

describe("isProtectedPath", () => {
  it.each(["/dashboard", "/dashboard/settings", "/profile", "/profile/edit"])(
    "protects %s",
    (pathname) => expect(isProtectedPath(pathname)).toBe(true),
  );

  it.each(["/", "/login", "/register", "/profiles"])(
    "leaves %s public",
    (pathname) => expect(isProtectedPath(pathname)).toBe(false),
  );
});
