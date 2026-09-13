import { describe, expect, it } from "vitest";

import { ERROR_CODES, ApplicationError, toApiErrorResponse } from "@/lib/api/errors";
import { apiError, apiSuccess } from "@/lib/api/response";

async function readJson(response: Response): Promise<Record<string, unknown>> {
  return (await response.json()) as Record<string, unknown>;
}

describe("API response contract", () => {
  it("returns data and list metadata without cache", async () => {
    const response = apiSuccess(["item"], 200, {
      message: "Thành công",
      meta: { page: 1, pageSize: 20, total: 1, totalPages: 1 },
    });

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store, max-age=0");
    await expect(readJson(response)).resolves.toEqual({
      success: true,
      data: ["item"],
      message: "Thành công",
      meta: { page: 1, pageSize: 20, total: 1, totalPages: 1 },
    });
  });

  it("returns the flat error contract with field errors and trace header", async () => {
    const response = apiError(new ApplicationError(ERROR_CODES.VALIDATION_ERROR), {
      errors: { email: ["Email không hợp lệ."] },
      path: "/api/v1/users",
    });
    const body = await readJson(response);

    expect(response.status).toBe(422);
    expect(response.headers.get("x-trace-id")).toBe(body.traceId);
    expect(body).toMatchObject({
      success: false,
      code: "VALIDATION_ERROR",
      message: "Dữ liệu không hợp lệ.",
      errors: { email: ["Email không hợp lệ."] },
      path: "/api/v1/users",
    });
    expect(body.timestamp).toEqual(expect.any(String));
    expect(body).not.toHaveProperty("stack");
  });

  it("hides unknown error details", () => {
    const mapped = toApiErrorResponse(new Error("database password leaked"), "trace-safe", {
      path: "/api/v1/products",
    });

    expect(mapped.status).toBe(500);
    expect(mapped.body).toEqual({
      success: false,
      code: "INTERNAL_ERROR",
      message: "Đã xảy ra lỗi không mong muốn.",
      traceId: "trace-safe",
      timestamp: expect.any(String),
      path: "/api/v1/products",
    });
    expect(JSON.stringify(mapped.body)).not.toContain("database password leaked");
  });
});
