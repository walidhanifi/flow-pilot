import { describe, it, expect } from "vitest";
import { loginSchema, signupSchema } from "@/types/auth";

describe("loginSchema", () => {
  it("accepts valid email and password", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty email", () => {
    const result = loginSchema.safeParse({
      email: "",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects password shorter than 8 characters", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "short",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const passwordError = result.error.issues.find(
        (i) => i.path[0] === "password"
      );
      expect(passwordError?.message).toBe(
        "Password must be at least 8 characters"
      );
    }
  });

  it("accepts password with exactly 8 characters", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "12345678",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing fields", () => {
    const result = loginSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("rejects null values", () => {
    const result = loginSchema.safeParse({
      email: null,
      password: null,
    });
    expect(result.success).toBe(false);
  });
});

describe("signupSchema", () => {
  it("accepts valid signup data with matching passwords", () => {
    const result = signupSchema.safeParse({
      email: "user@example.com",
      password: "password123",
      confirmPassword: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects mismatched passwords", () => {
    const result = signupSchema.safeParse({
      email: "user@example.com",
      password: "password123",
      confirmPassword: "differentpassword",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const confirmError = result.error.issues.find(
        (i) => i.path[0] === "confirmPassword"
      );
      expect(confirmError?.message).toBe("Passwords do not match");
    }
  });

  it("rejects invalid email", () => {
    const result = signupSchema.safeParse({
      email: "bad-email",
      password: "password123",
      confirmPassword: "password123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects short password", () => {
    const result = signupSchema.safeParse({
      email: "user@example.com",
      password: "short",
      confirmPassword: "short",
    });
    expect(result.success).toBe(false);
  });

  it("rejects short confirmPassword", () => {
    const result = signupSchema.safeParse({
      email: "user@example.com",
      password: "password123",
      confirmPassword: "short",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing confirmPassword", () => {
    const result = signupSchema.safeParse({
      email: "user@example.com",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty object", () => {
    const result = signupSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
