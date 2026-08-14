import { describe, expect, it } from "vitest";

import { safeNextPath } from "./redirect";

describe("safeNextPath", () => {
  it("keeps local paths with query strings", () => {
    expect(safeNextPath("/profile?tab=contact")).toBe("/profile?tab=contact");
  });

  it.each(["https://evil.example", "//evil.example", "profile", "/\\evil.example"])(
    "rejects unsafe redirect value %s",
    (value) => {
      expect(safeNextPath(value)).toBe("/dashboard");
    },
  );
});
