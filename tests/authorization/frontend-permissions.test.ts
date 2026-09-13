import { describe, expect, it } from "vitest";

import { can } from "../../src/features/auth/permissions";

describe("frontend permission helper", () => {
  it("supports one or multiple required permissions without knowing the policy", () => {
    const permissions = ["PRODUCT_VIEW", "PRODUCT_UPDATE"] as const;

    expect(can(permissions, "PRODUCT_VIEW")).toBe(true);
    expect(can(permissions, ["PRODUCT_VIEW", "PRODUCT_UPDATE"])).toBe(true);
    expect(can(permissions, ["PRODUCT_VIEW", "USER_DELETE"])).toBe(false);
  });

  it("denies an empty permission set by default", () => {
    expect(can([], "PRODUCT_VIEW")).toBe(false);
  });
});
