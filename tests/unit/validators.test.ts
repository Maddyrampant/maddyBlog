import { describe, it, expect } from "vitest";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(30),
  password: z.string().min(6),
});

describe("register validation", () => {
  it("accepts valid input", () => {
    const result = registerSchema.safeParse({
      email: "test@example.com",
      username: "testuser",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = registerSchema.safeParse({
      email: "not-an-email",
      username: "testuser",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects short password", () => {
    const result = registerSchema.safeParse({
      email: "test@example.com",
      username: "testuser",
      password: "12345",
    });
    expect(result.success).toBe(false);
  });

  it("rejects short username", () => {
    const result = registerSchema.safeParse({
      email: "test@example.com",
      username: "ab",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });
});
