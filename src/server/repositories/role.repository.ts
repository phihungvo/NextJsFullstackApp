import "server-only";

import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";

export type RoleListQuery = {
  readonly page: number;
  readonly pageSize: number;
  readonly search?: string;
  readonly sortBy: "name" | "code" | "createdAt" | "updatedAt";
  readonly sortOrder: "asc" | "desc";
};

const roleSelect = {
  id: true,
  name: true,
  code: true,
  description: true,
  createdAt: true,
  updatedAt: true,
  permissions: {
    select: {
      permission: {
        select: { code: true },
      },
    },
  },
} satisfies Prisma.RoleSelect;

export type RoleRecord = Prisma.RoleGetPayload<{ select: typeof roleSelect }>;

export async function listRoles(query: RoleListQuery): Promise<{
  readonly items: readonly RoleRecord[];
  readonly total: number;
}> {
  const where: Prisma.RoleWhereInput = query.search
    ? {
        OR: [{ name: { contains: query.search } }, { code: { contains: query.search } }],
      }
    : {};
  const orderBy = { [query.sortBy]: query.sortOrder } as Prisma.RoleOrderByWithRelationInput;

  const [items, total] = await Promise.all([
    prisma.role.findMany({
      where,
      orderBy,
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
      select: roleSelect,
    }),
    prisma.role.count({ where }),
  ]);

  return { items, total };
}

export async function findRoleById(id: string): Promise<RoleRecord | null> {
  return prisma.role.findUnique({ where: { id }, select: roleSelect });
}

type RoleWriteData = {
  readonly name: string;
  readonly code: string;
  readonly description: string | null;
  readonly permissionCodes: readonly string[];
};

async function resolvePermissionIds(
  client: Prisma.TransactionClient,
  permissionCodes: readonly string[],
): Promise<readonly string[]> {
  const uniqueCodes = [...new Set(permissionCodes)];
  if (uniqueCodes.length === 0) return [];

  const permissions = await client.permission.findMany({
    where: { code: { in: uniqueCodes } },
    select: { id: true, code: true },
  });
  if (permissions.length !== uniqueCodes.length) {
    throw new Error("One or more permission codes do not exist");
  }

  return permissions.map(({ id }) => id);
}

export async function createRole(data: RoleWriteData): Promise<RoleRecord> {
  return prisma.$transaction(async (tx) => {
    const permissionIds = await resolvePermissionIds(tx, data.permissionCodes);
    return tx.role.create({
      data: {
        name: data.name,
        code: data.code,
        description: data.description,
        permissions: {
          create: permissionIds.map((permissionId) => ({ permissionId })),
        },
      },
      select: roleSelect,
    });
  });
}

export type RoleUpdateData = {
  readonly name?: string;
  readonly code?: string;
  readonly description?: string | null;
  readonly permissionCodes?: readonly string[];
};

export async function updateRole(id: string, data: RoleUpdateData): Promise<RoleRecord | null> {
  const existing = await findRoleById(id);
  if (!existing) return null;

  return prisma.$transaction(async (tx) => {
    const { permissionCodes, ...roleData } = data;
    await tx.role.update({ where: { id }, data: roleData });

    if (permissionCodes !== undefined) {
      const permissionIds = await resolvePermissionIds(tx, permissionCodes);
      await tx.rolePermission.deleteMany({ where: { roleId: id } });
      if (permissionIds.length > 0) {
        await tx.rolePermission.createMany({
          data: permissionIds.map((permissionId) => ({ roleId: id, permissionId })),
        });
      }
    }

    return tx.role.findUniqueOrThrow({ where: { id }, select: roleSelect });
  });
}

export async function deleteRole(id: string): Promise<{ readonly id: string } | null> {
  const existing = await findRoleById(id);
  if (!existing) return null;
  await prisma.role.delete({ where: { id } });
  return { id };
}
