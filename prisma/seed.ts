import argon2 from "argon2";

import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import {
  PrismaClient,
  ProductStatus,
  ProductVisibility,
  UserStatus,
} from "../src/generated/prisma/client";

const permissionDefinitions = [
  ["PRODUCT_VIEW", "View products"],
  ["PRODUCT_CREATE", "Create products"],
  ["PRODUCT_UPDATE", "Update products"],
  ["PRODUCT_DELETE", "Delete products"],
  ["USER_VIEW", "View users"],
  ["USER_CREATE", "Create users"],
  ["USER_UPDATE", "Update users"],
  ["USER_DELETE", "Delete users"],
  ["ROLE_VIEW", "View roles"],
  ["ROLE_CREATE", "Create roles"],
  ["ROLE_UPDATE", "Update roles"],
  ["ROLE_DELETE", "Delete roles"],
  ["PERMISSION_VIEW", "View permissions"],
  ["PERMISSION_CREATE", "Create permissions"],
  ["PERMISSION_UPDATE", "Update permissions"],
  ["PERMISSION_DELETE", "Delete permissions"],
] as const;

const developmentProducts = [
  {
    name: "Sample Product One",
    slug: "sample-product-one",
    description: "Development-only sample product.",
    price: "19.99",
    currency: "USD",
    status: ProductStatus.PUBLISHED,
    visibility: ProductVisibility.PUBLIC,
  },
  {
    name: "Sample Product Two",
    slug: "sample-product-two",
    description: "Development-only draft product.",
    price: "49.00",
    currency: "USD",
    status: ProductStatus.DRAFT,
    visibility: ProductVisibility.PRIVATE,
  },
] as const;

function requiredEnvironment(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required seed environment variable: ${name}`);
  }

  return value;
}

function requiredSeedPassword(name: string): string {
  const value = requiredEnvironment(name);
  if (value.length < 12) {
    throw new Error(`${name} must contain at least 12 characters`);
  }

  return value;
}

async function main(): Promise<void> {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Database seed is restricted to non-production environments");
  }

  const databaseUrl = requiredEnvironment("DATABASE_URL");
  const adminPassword = requiredSeedPassword("SEED_ADMIN_PASSWORD");
  const userPassword = requiredSeedPassword("SEED_USER_PASSWORD");
  const adapter = new PrismaMariaDb(databaseUrl);
  const prisma = new PrismaClient({ adapter });

  try {
    const permissions = await Promise.all(
      permissionDefinitions.map(([code, name]) =>
        prisma.permission.upsert({
          where: { code },
          update: { name },
          create: { code, name },
        }),
      ),
    );

    const adminRole = await prisma.role.upsert({
      where: { code: "ADMIN" },
      update: { name: "Administrator" },
      create: { code: "ADMIN", name: "Administrator" },
    });
    const userRole = await prisma.role.upsert({
      where: { code: "USER" },
      update: { name: "User" },
      create: { code: "USER", name: "User" },
    });

    await Promise.all(
      permissions.map((permission) =>
        prisma.rolePermission.upsert({
          where: {
            roleId_permissionId: { roleId: adminRole.id, permissionId: permission.id },
          },
          update: {},
          create: { roleId: adminRole.id, permissionId: permission.id },
        }),
      ),
    );

    const productViewPermission = permissions.find(
      (permission) => permission.code === "PRODUCT_VIEW",
    );
    if (!productViewPermission) {
      throw new Error("Seed permission definition is incomplete");
    }

    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: { roleId: userRole.id, permissionId: productViewPermission.id },
      },
      update: {},
      create: { roleId: userRole.id, permissionId: productViewPermission.id },
    });

    const [adminPasswordHash, userPasswordHash] = await Promise.all([
      argon2.hash(adminPassword, { type: argon2.argon2id }),
      argon2.hash(userPassword, { type: argon2.argon2id }),
    ]);

    const adminUser = await prisma.user.upsert({
      where: { email: "admin@example.test" },
      update: {
        name: "Development Admin",
        passwordHash: adminPasswordHash,
        status: UserStatus.ACTIVE,
        deletedAt: null,
      },
      create: {
        email: "admin@example.test",
        name: "Development Admin",
        passwordHash: adminPasswordHash,
        status: UserStatus.ACTIVE,
      },
    });
    const normalUser = await prisma.user.upsert({
      where: { email: "user@example.test" },
      update: {
        name: "Development User",
        passwordHash: userPasswordHash,
        status: UserStatus.ACTIVE,
        deletedAt: null,
      },
      create: {
        email: "user@example.test",
        name: "Development User",
        passwordHash: userPasswordHash,
        status: UserStatus.ACTIVE,
      },
    });

    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: adminUser.id, roleId: adminRole.id } },
      update: {},
      create: { userId: adminUser.id, roleId: adminRole.id },
    });
    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: normalUser.id, roleId: userRole.id } },
      update: {},
      create: { userId: normalUser.id, roleId: userRole.id },
    });

    await Promise.all(
      developmentProducts.map((product) =>
        prisma.product.upsert({
          where: { slug: product.slug },
          update: product,
          create: product,
        }),
      ),
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error("Database seed failed", error instanceof Error ? error.name : "UnknownError");
  process.exitCode = 1;
});
