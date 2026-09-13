import { beforeEach, describe, expect, it, vi } from "vitest";

import { ERROR_CODES, ApplicationError } from "@/lib/api/errors";

const mocks = vi.hoisted(() => ({
  requirePermission: vi.fn(),
  listProductService: vi.fn(),
  createProductService: vi.fn(),
  getProductService: vi.fn(),
  updateProductService: vi.fn(),
  archiveProductService: vi.fn(),
  listUserService: vi.fn(),
  createUserService: vi.fn(),
  getUserService: vi.fn(),
  updateUserService: vi.fn(),
  deleteUserService: vi.fn(),
  listRoleService: vi.fn(),
  createRoleService: vi.fn(),
  getRoleService: vi.fn(),
  updateRoleService: vi.fn(),
  deleteRoleService: vi.fn(),
  listPermissionService: vi.fn(),
  getPermissionService: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("@/server/authorization/service", () => ({
  requirePermission: mocks.requirePermission,
}));
vi.mock("@/server/services/product.service", () => ({
  listProductService: mocks.listProductService,
  createProductService: mocks.createProductService,
  getProductService: mocks.getProductService,
  updateProductService: mocks.updateProductService,
  archiveProductService: mocks.archiveProductService,
}));
vi.mock("@/server/services/user.service", () => ({
  listUserService: mocks.listUserService,
  createUserService: mocks.createUserService,
  getUserService: mocks.getUserService,
  updateUserService: mocks.updateUserService,
  deleteUserService: mocks.deleteUserService,
}));
vi.mock("@/server/services/role.service", () => ({
  listRoleService: mocks.listRoleService,
  createRoleService: mocks.createRoleService,
  getRoleService: mocks.getRoleService,
  updateRoleService: mocks.updateRoleService,
  deleteRoleService: mocks.deleteRoleService,
}));
vi.mock("@/server/services/permission.service", () => ({
  listPermissionService: mocks.listPermissionService,
  getPermissionService: mocks.getPermissionService,
}));

const productList = await import("../../src/app/api/v1/products/route");
const productDetail = await import("../../src/app/api/v1/products/[id]/route");
const userList = await import("../../src/app/api/v1/users/route");
const userDetail = await import("../../src/app/api/v1/users/[id]/route");
const roleList = await import("../../src/app/api/v1/roles/route");
const roleDetail = await import("../../src/app/api/v1/roles/[id]/route");
const permissionList = await import("../../src/app/api/v1/permissions/route");
const permissionDetail = await import("../../src/app/api/v1/permissions/[id]/route");

const actor = { id: "admin_1" };
const product = {
  id: "product_1",
  name: "Product One",
  slug: "product-one",
  description: null,
  price: "19.99",
  currency: "USD",
  status: "DRAFT",
  visibility: "PRIVATE",
  createdAt: "2030-01-01T00:00:00.000Z",
  updatedAt: "2030-01-01T00:00:00.000Z",
};
const user = {
  id: "user_1",
  email: "user@example.test",
  name: "User",
  status: "ACTIVE",
  roles: ["USER"],
  createdAt: "2030-01-01T00:00:00.000Z",
  updatedAt: "2030-01-01T00:00:00.000Z",
};
const role = {
  id: "role_1",
  name: "Operator",
  code: "OPERATOR",
  description: null,
  permissionCodes: ["PRODUCT_VIEW"],
  createdAt: "2030-01-01T00:00:00.000Z",
  updatedAt: "2030-01-01T00:00:00.000Z",
};
const permission = {
  id: "permission_1",
  name: "View products",
  code: "PRODUCT_VIEW",
  description: null,
  createdAt: "2030-01-01T00:00:00.000Z",
  updatedAt: "2030-01-01T00:00:00.000Z",
};

const listMeta = { page: 1, pageSize: 20, total: 1, totalPages: 1 };

function request(url: string, init?: RequestInit): Request {
  return new Request(`http://localhost${url}`, init);
}

async function json(response: Response): Promise<Record<string, unknown>> {
  return (await response.json()) as Record<string, unknown>;
}

function context(id = "resource_1") {
  return { params: Promise.resolve({ id }) };
}

describe("versioned API routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requirePermission.mockResolvedValue(actor);
    mocks.listProductService.mockResolvedValue({ items: [product], meta: listMeta });
    mocks.listUserService.mockResolvedValue({ items: [user], meta: listMeta });
    mocks.listRoleService.mockResolvedValue({ items: [role], meta: listMeta });
    mocks.listPermissionService.mockResolvedValue({ items: [permission], meta: listMeta });
    mocks.createProductService.mockResolvedValue(product);
    mocks.createUserService.mockResolvedValue(user);
    mocks.createRoleService.mockResolvedValue(role);
    mocks.getProductService.mockResolvedValue(product);
    mocks.getUserService.mockResolvedValue(user);
    mocks.getRoleService.mockResolvedValue(role);
    mocks.getPermissionService.mockResolvedValue(permission);
    mocks.updateProductService.mockResolvedValue(product);
    mocks.archiveProductService.mockResolvedValue({ id: product.id, archived: true });
    mocks.updateUserService.mockResolvedValue(user);
    mocks.deleteUserService.mockResolvedValue({ id: user.id, deleted: true });
    mocks.updateRoleService.mockResolvedValue(role);
    mocks.deleteRoleService.mockResolvedValue({ id: role.id, deleted: true });
  });

  it("returns the standard paginated product response and forwards whitelisted query values", async () => {
    const response = await productList.GET(
      request(
        "/api/v1/products?page=2&pageSize=10&sortBy=price&sortOrder=asc&search=widget&status=DRAFT",
      ),
    );
    const body = await json(response);

    expect(response.status).toBe(200);
    expect(body).toEqual({ success: true, data: [product], meta: listMeta });
    expect(mocks.listProductService).toHaveBeenCalledWith({
      page: 2,
      pageSize: 10,
      search: "widget",
      status: "DRAFT",
      sortBy: "price",
      sortOrder: "asc",
    });
  });

  it("rejects invalid query and mutation payloads with field-safe validation errors", async () => {
    const queryResponse = await productList.GET(request("/api/v1/products?sortBy=rawSql"));
    const queryBody = await json(queryResponse);
    const payloadResponse = await productList.POST(
      request("/api/v1/products", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: "Product", price: "not-a-price", unexpected: true }),
      }),
    );
    const payloadBody = await json(payloadResponse);

    expect(queryResponse.status).toBe(422);
    expect(queryBody).toMatchObject({
      success: false,
      code: "VALIDATION_ERROR",
      path: "/api/v1/products",
    });
    expect(payloadResponse.status).toBe(422);
    expect(payloadBody).toMatchObject({
      success: false,
      code: "VALIDATION_ERROR",
      path: "/api/v1/products",
    });
    expect(payloadBody).not.toHaveProperty("stack");
    expect(mocks.createProductService).not.toHaveBeenCalled();
  });

  it("supports product create/read/update/archive and maps not-found", async () => {
    const createResponse = await productList.POST(
      request("/api/v1/products", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: "Product One", slug: "product-one", price: "19.99" }),
      }),
    );
    const getResponse = await productDetail.GET(
      request("/api/v1/products/product_1"),
      context("product_1"),
    );
    const updateResponse = await productDetail.PATCH(
      request("/api/v1/products/product_1", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: "Updated Product" }),
      }),
      context("product_1"),
    );
    const deleteResponse = await productDetail.DELETE(
      request("/api/v1/products/product_1", { method: "DELETE" }),
      context("product_1"),
    );

    expect(createResponse.status).toBe(201);
    expect(getResponse.status).toBe(200);
    expect(updateResponse.status).toBe(200);
    expect(deleteResponse.status).toBe(200);
    mocks.getProductService.mockRejectedValueOnce(new ApplicationError(ERROR_CODES.NOT_FOUND));
    const notFoundResponse = await productDetail.GET(
      request("/api/v1/products/missing"),
      context("missing"),
    );
    const notFoundBody = await json(notFoundResponse);
    expect(notFoundResponse.status).toBe(404);
    expect(notFoundBody).toMatchObject({
      success: false,
      code: "NOT_FOUND",
      path: "/api/v1/products/[id]",
    });
  });

  it("serves user list/create/detail/update/delete through permission-gated routes", async () => {
    const listResponse = await userList.GET(request("/api/v1/users?status=ACTIVE&sortBy=email"));
    const createResponse = await userList.POST(
      request("/api/v1/users", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: "new@example.test",
          name: "New User",
          password: "long-development-password",
        }),
      }),
    );
    const detailResponse = await userDetail.GET(request("/api/v1/users/user_1"), context("user_1"));
    const updateResponse = await userDetail.PATCH(
      request("/api/v1/users/user_1", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status: "SUSPENDED" }),
      }),
      context("user_1"),
    );
    const deleteResponse = await userDetail.DELETE(
      request("/api/v1/users/user_1", { method: "DELETE" }),
      context("user_1"),
    );

    expect(listResponse.status).toBe(200);
    expect(createResponse.status).toBe(201);
    expect(detailResponse.status).toBe(200);
    expect(updateResponse.status).toBe(200);
    expect(deleteResponse.status).toBe(200);
    expect(mocks.listUserService).toHaveBeenCalledWith({
      page: 1,
      pageSize: 20,
      status: "ACTIVE",
      sortBy: "email",
      sortOrder: "desc",
    });
  });

  it("serves role CRUD and permission assignment using the API contract", async () => {
    const listResponse = await roleList.GET(request("/api/v1/roles?sortBy=code&sortOrder=asc"));
    const createResponse = await roleList.POST(
      request("/api/v1/roles", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: "Operator",
          code: "OPERATOR",
          permissionCodes: ["PRODUCT_VIEW"],
        }),
      }),
    );
    const detailResponse = await roleDetail.GET(request("/api/v1/roles/role_1"), context("role_1"));
    const updateResponse = await roleDetail.PATCH(
      request("/api/v1/roles/role_1", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ permissionCodes: ["PRODUCT_VIEW", "PRODUCT_UPDATE"] }),
      }),
      context("role_1"),
    );
    const deleteResponse = await roleDetail.DELETE(
      request("/api/v1/roles/role_1", { method: "DELETE" }),
      context("role_1"),
    );

    expect(listResponse.status).toBe(200);
    expect(createResponse.status).toBe(201);
    expect(detailResponse.status).toBe(200);
    expect(updateResponse.status).toBe(200);
    expect(deleteResponse.status).toBe(200);
  });

  it("serves extensible permission list/detail with pagination metadata", async () => {
    const listResponse = await permissionList.GET(
      request("/api/v1/permissions?search=product&pageSize=5"),
    );
    const detailResponse = await permissionDetail.GET(
      request("/api/v1/permissions/permission_1"),
      context("permission_1"),
    );
    const listBody = await json(listResponse);
    const detailBody = await json(detailResponse);

    expect(listResponse.status).toBe(200);
    expect(listBody).toEqual({ success: true, data: [permission], meta: listMeta });
    expect(detailResponse.status).toBe(200);
    expect(detailBody).toEqual({ success: true, data: permission });
  });
});
