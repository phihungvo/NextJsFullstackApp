import { beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

process.env.NODE_ENV = "test";
process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";
process.env.DATABASE_URL = "mysql://test:test@localhost:3306/test";
process.env.REDIS_URL = "redis://localhost:6379";
process.env.AUTH_SECRET = "test-secret-that-is-at-least-32-characters-long";

const { createSessionToken, hashSessionToken } = await import(
  "../../src/server/auth/session-token"
);

describe("session token", () => {
  beforeAll(() => {
    expect(process.env.AUTH_SECRET).toHaveLength(47);
  });

  it("creates high-entropy opaque tokens", () => {
    const first = createSessionToken();
    const second = createSessionToken();

    expect(first).toHaveLength(43);
    expect(second).toHaveLength(43);
    expect(first).not.toBe(second);
  });

  it("stores only a deterministic HMAC digest", () => {
    const token = createSessionToken();
    const digest = hashSessionToken(token);

    expect(digest).toHaveLength(64);
    expect(digest).toMatch(/^[a-f0-9]+$/);
    expect(digest).toBe(hashSessionToken(token));
    expect(digest).not.toContain(token);
  });
});
