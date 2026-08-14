import { describe, expect, it } from "vitest";

import { authErrorCode, publicErrorMessage } from "./errors";
import { loginSchema, registerSchema } from "./schemas";

describe("auth validation", () => {
  it("accepts valid login input", () => {
    expect(
      loginSchema.safeParse({ email: "user@example.com", password: "secret" }).success,
    ).toBe(true);
  });

  const validRegistration = {
    fullName: "EV User",
    email: "user@example.com",
    password: "Strong!Pass1",
    terms: "on" as const,
  };

  it("accepts registration input that satisfies the approved password policy", () => {
    expect(registerSchema.safeParse(validRegistration).success).toBe(true);
  });

  it.each([
    ["fewer than eight characters", "Sh0rt!"],
    ["no lowercase letter", "STRONG!PASS1"],
    ["no uppercase letter", "strong!pass1"],
    ["no number", "Strong!Pass"],
    ["no special character", "StrongPass1"],
  ])("rejects a registration password with %s", (_case, password) => {
    expect(
      registerSchema.safeParse({
        ...validRegistration,
        password,
      }).success,
    ).toBe(false);
  });

  it("requires registration consent", () => {
    expect(
      registerSchema.safeParse({ ...validRegistration, terms: "" }).success,
    ).toBe(false);
  });
});

describe("public auth errors", () => {
  it("maps provider rate limits without exposing provider messages", () => {
    expect(authErrorCode({ code: "over_email_send_rate_limit" })).toBe(
      "email_rate_limited",
    );
  });

  it("does not render unknown query-string error text", () => {
    expect(publicErrorMessage("provider internal detail")).toBeNull();
  });
});
