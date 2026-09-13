import "server-only";

import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";

export type PermissionListQuery = {
  readonly page: number;
  readonly pageSize: number;
  readonly search?: string;
  readonly sortBy: "name" | "code" | "createdAt" | "updatedAt";
  readonly sortOrder: "asc" | "desc";
};

const permissionSelect = {
  id: true,
  name: true,
  code: true,
  description: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.PermissionSelect;

export type PermissionRecord = Prisma.PermissionGetPayload<{ select: typeof permissionSelect }>;

export async function listPermissions(query: PermissionListQuery): Promise<{
  readonly items: readonly PermissionRecord[];
  readonly total: number;
}> {
  const where: Prisma.PermissionWhereInput = query.search
    ? {
        OR: [{ name: { contains: query.search } }, { code: { contains: query.search } }],
      }
    : {};
  const orderBy = { [query.sortBy]: query.sortOrder } as Prisma.PermissionOrderByWithRelationInput;

  const [items, total] = await Promise.all([
    prisma.permission.findMany({
      where,
      orderBy,
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
      select: permissionSelect,
    }),
    prisma.permission.count({ where }),
  ]);

  return { items, total };
}

export async function findPermissionById(id: string): Promise<PermissionRecord | null> {
  return prisma.permission.findUnique({ where: { id }, select: permissionSelect });
}
