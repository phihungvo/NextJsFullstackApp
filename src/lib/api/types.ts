export type ProductStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type ProductVisibility = "PRIVATE" | "PUBLIC";
export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export type Product = {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly description: string | null;
  readonly price: string;
  readonly currency: string;
  readonly status: ProductStatus;
  readonly visibility: ProductVisibility;
  readonly createdAt: string;
  readonly updatedAt: string;
};

export type User = {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly status: UserStatus;
  readonly roles: readonly string[];
  readonly createdAt: string;
  readonly updatedAt: string;
};

export type Role = {
  readonly id: string;
  readonly name: string;
  readonly code: string;
  readonly description: string | null;
  readonly permissionCodes: readonly string[];
  readonly createdAt: string;
  readonly updatedAt: string;
};

export type Permission = {
  readonly id: string;
  readonly name: string;
  readonly code: string;
  readonly description: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
};
