import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { hashPassword, verifyPassword } = await import("../../src/server/auth/password");

describe("password authentication", () => {
  it("hashes passwords with Argon2id and verifies the original password", async () => {
    const hash = await hashPassword("correct horse battery staple");

    expect(hash).toMatch(/^\$argon2id\$/);
    await expect(verifyPassword("correct horse battery staple", hash)).resolves.toBe(true);
    await expect(verifyPassword("wrong password", hash)).resolves.toBe(false);
  });

  it("does not disclose malformed or missing password hashes", async () => {
    await expect(verifyPassword("any password")).resolves.toBe(false);
    await expect(verifyPassword("any password", "not-a-password-hash")).resolves.toBe(false);
  });
});
