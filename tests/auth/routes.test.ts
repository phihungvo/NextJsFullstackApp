import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const mocks = vi.hoisted(() => ({
  authenticateCredentials: vi.fn(),
  consumeLoginRateLimit: vi.fn(),
  getClientAddress: vi.fn(),
  createSession: vi.fn(),
  setSessionCookie: vi.fn(),
  clearSessionCookie: vi.fn(),
  getCurrentSessionToken: vi.fn(),
  revokeSession: vi.fn(),
  getCurrentUser: vi.fn(),
}));

vi.mock("@/server/auth/credentials", () => ({
  authenticateCredentials: mocks.authenticateCredentials,
}));
vi.mock("@/server/auth/rate-limit", () => ({
  consumeLoginRateLimit: mocks.consumeLoginRateLimit,
  getClientAddress: mocks.getClientAddress,
}));
vi.mock("@/server/auth/session", () => ({
  createSession: mocks.createSession,
  getCurrentSessionToken: mocks.getCurrentSessionToken,
  revokeSession: mocks.revokeSession,
  getCurrentUser: mocks.getCurrentUser,
}));
vi.mock("@/server/auth/cookies", () => ({
  setSessionCookie: mocks.setSessionCookie,
  clearSessionCookie: mocks.clearSessionCookie,
}));

const { POST: login } = await import("../../src/app/api/v1/auth/login/route");
const { POST: logout } = await import("../../src/app/api/v1/auth/logout/route");
const { GET: me } = await import("../../src/app/api/v1/auth/me/route");

const authenticatedUser = {
  id: "user_1",
  email: "admin@example.com",
  name: "Admin",
  status: "ACTIVE",
  passwordHash: "argon2-hash-is-not-returned",
  roles: [{ role: { code: "ADMIN" } }],
};

function jsonRequest(body: unknown): Request {
  return new Request("http://localhost/api/v1/auth/login", {
    method: "POST",
    headers: { "content-type": "application/json", "x-real-ip": "127.0.0.1" },
    body: JSON.stringify(body),
  });
}

async function readJson(response: Response): Promise<Record<string, unknown>> {
  return (await response.json()) as Record<string, unknown>;
}

describe("authentication routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getClientAddress.mockReturnValue("127.0.0.1");
    mocks.consumeLoginRateLimit.mockResolvedValue({
      allowed: true,
      remaining: 4,
      retryAfterSeconds: 60,
    });
    mocks.createSession.mockResolvedValue({
      token: "opaque-session-token",
      expiresAt: new Date("2030-01-01T00:00:00.000Z"),
    });
  });

  it("logs in successfully without returning password or raw session token", async () => {
    mocks.authenticateCredentials.mockResolvedValue(authenticatedUser);

    const response = await login(jsonRequest({
      email: "ADMIN@EXAMPLE.COM",
      password: "correct-password",
    }));
    const body = await readJson(response);
    const serialized = JSON.stringify(body);

    expect(response.status).toBe(200);
    expect(body).toEqual({
      data: {
        user: {
          id: "user_1",
          email: "admin@example.com",
          name: "Admin",
          status: "ACTIVE",
          roles: ["ADMIN"],
        },
        expiresAt: "2030-01-01T00:00:00.000Z",
      },
    });
    expect(serialized).not.toContain("passwordHash");
    expect(serialized).not.toContain("opaque-session-token");
    expect(mocks.setSessionCookie).toHaveBeenCalledOnce();
  });

  it("uses the same generic error for wrong password and unknown user", async () => {
    mocks.authenticateCredentials.mockResolvedValue(null);

    const wrongPasswordResponse = await login(
      jsonRequest({ email: "admin@example.com", password: "wrong-password" }),
    );
    const unknownUserResponse = await login(
      jsonRequest({ email: "unknown@example.com", password: "wrong-password" }),
    );
    const wrongPasswordBody = await readJson(wrongPasswordResponse);
    const unknownUserBody = await readJson(unknownUserResponse);

    expect(wrongPasswordResponse.status).toBe(401);
    expect(unknownUserResponse.status).toBe(401);
    expect(wrongPasswordBody.error).toMatchObject({
      code: "UNAUTHORIZED",
      message: "Email hoặc mật khẩu không đúng.",
    });
    expect(unknownUserBody.error).toMatchObject(wrongPasswordBody.error as object);
  });

  it("returns 429 when the login rate limit is exceeded", async () => {
    mocks.consumeLoginRateLimit.mockResolvedValue({
      allowed: false,
      remaining: 0,
      retryAfterSeconds: 60,
    });

    const response = await login(
      jsonRequest({ email: "admin@example.com", password: "any-password" }),
    );
    const body = await readJson(response);

    expect(response.status).toBe(429);
    expect(body.error).toMatchObject({ code: "RATE_LIMITED" });
    expect(mocks.authenticateCredentials).not.toHaveBeenCalled();
  });

  it("logs out by revoking the current session", async () => {
    mocks.getCurrentSessionToken.mockResolvedValue("opaque-session-token");

    const response = await logout();
    const body = await readJson(response);

    expect(response.status).toBe(200);
    expect(body).toEqual({ data: { success: true } });
    expect(mocks.revokeSession).toHaveBeenCalledWith("opaque-session-token");
    expect(mocks.clearSessionCookie).toHaveBeenCalledOnce();
  });

  it("returns the public current user and rejects an anonymous request", async () => {
    mocks.getCurrentUser.mockResolvedValue({
      id: "user_1",
      email: "admin@example.com",
      name: "Admin",
      status: "ACTIVE",
      roles: ["ADMIN"],
    });

    const authenticatedResponse = await me();
    const authenticatedBody = await readJson(authenticatedResponse);

    mocks.getCurrentUser.mockResolvedValue(null);
    const anonymousResponse = await me();
    const anonymousBody = await readJson(anonymousResponse);

    expect(authenticatedResponse.status).toBe(200);
    expect(authenticatedBody).toEqual({
      data: {
        user: {
          id: "user_1",
          email: "admin@example.com",
          name: "Admin",
          status: "ACTIVE",
          roles: ["ADMIN"],
        },
      },
    });
    expect(anonymousResponse.status).toBe(401);
    expect(anonymousBody.error).toMatchObject({ code: "UNAUTHORIZED" });
  });
});
