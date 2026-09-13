import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const mocks = vi.hoisted(() => ({
  findMany: vi.fn(),
  findFirst: vi.fn(),
  getCurrentUser: vi.fn(),
}));

vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    userRole: {
      findMany: mocks.findMany,
      findFirst: mocks.findFirst,
    },
  },
}));
vi.mock("@/server/auth/session", () => ({
  getCurrentUser: mocks.getCurrentUser,
}));

const { getUserPermissionCodes, hasPermission, requirePermission } =
  await import("../../src/server/authorization/service");
const { requireAuth } = await import("../../src/server/authorization/require-auth");
const { PERMISSIONS } = await import("../../src/server/authorization/permissions");
const { ApplicationError, ERROR_CODES } = await import("../../src/lib/api/errors");
const { toApiErrorResponse } = await import("../../src/lib/api/errors");

const adminUser = {
  id: "admin_1",
  email: "admin@example.test",
  name: "Admin",
  status: "ACTIVE",
  roles: ["ADMIN"],
  permissions: Object.values(PERMISSIONS),
};

describe("authorization service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("resolves unique permissions across all assigned roles", async () => {
    mocks.findMany.mockResolvedValue([
      {
        role: {
          permissions: [
            { permission: { code: "PRODUCT_VIEW" } },
            { permission: { code: "PRODUCT_CREATE" } },
          ],
        },
      },
      {
        role: {
          permissions: [
            { permission: { code: "PRODUCT_VIEW" } },
            { permission: { code: "USER_VIEW" } },
          ],
        },
      },
    ]);

    await expect(getUserPermissionCodes("admin_1")).resolves.toEqual([
      "PRODUCT_VIEW",
      "PRODUCT_CREATE",
      "USER_VIEW",
    ]);
  });

  it("allows an assigned permission and denies an unassigned permission", async () => {
    mocks.findFirst.mockResolvedValueOnce({ userId: "admin_1" }).mockResolvedValueOnce(null);

    await expect(hasPermission("admin_1", "PRODUCT_CREATE")).resolves.toBe(true);
    await expect(hasPermission("user_1", "USER_DELETE")).resolves.toBe(false);
  });

  it("requires authentication before checking permission", async () => {
    mocks.getCurrentUser.mockResolvedValue(null);

    await expect(requireAuth()).rejects.toMatchObject({
      code: ERROR_CODES.UNAUTHORIZED,
      status: 401,
    });
    await expect(requirePermission("PRODUCT_VIEW")).rejects.toMatchObject({
      code: ERROR_CODES.UNAUTHORIZED,
      status: 401,
    });
    expect(mocks.findFirst).not.toHaveBeenCalled();
  });

  it("returns the user with permission and throws 403 without it", async () => {
    mocks.getCurrentUser.mockResolvedValue(adminUser);
    mocks.findFirst.mockResolvedValueOnce({ userId: "admin_1" }).mockResolvedValueOnce(null);

    await expect(requirePermission(PERMISSIONS.PERMISSION_DELETE)).resolves.toEqual(adminUser);
    await expect(requirePermission("ROLE_DELETE")).rejects.toMatchObject(
      new ApplicationError(ERROR_CODES.FORBIDDEN),
    );
  });

  it("maps a denied authorization decision to a safe 403 response", async () => {
    const response = toApiErrorResponse(
      new ApplicationError(ERROR_CODES.FORBIDDEN),
      "trace-forbidden",
    );

    expect(response.status).toBe(403);
    expect(response.body).toMatchObject({
      success: false,
      code: "FORBIDDEN",
      message: "Bạn không có quyền thực hiện thao tác này.",
      traceId: "trace-forbidden",
      path: "/api/unknown",
    });
  });
});
