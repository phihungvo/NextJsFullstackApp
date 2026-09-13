import "server-only";

import type { Prisma, UserStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";

export type UserListQuery = {
  readonly page: number;
  readonly pageSize: number;
  readonly search?: string;
  readonly status?: UserStatus;
  readonly sortBy: "email" | "name" | "status" | "createdAt" | "updatedAt";
  readonly sortOrder: "asc" | "desc";
};

const userSelect = {
  id: true,
  email: true,
  name: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  roles: {
    select: {
      role: {
        select: { code: true },
      },
    },
  },
} satisfies Prisma.UserSelect;

export type UserRecord = Prisma.UserGetPayload<{ select: typeof userSelect }>;

export async function listUsers(query: UserListQuery): Promise<{
  readonly items: readonly UserRecord[];
  readonly total: number;
}> {
  const where: Prisma.UserWhereInput = {
    deletedAt: null,
    ...(query.status ? { status: query.status } : {}),
    ...(query.search
      ? {
          OR: [{ email: { contains: query.search } }, { name: { contains: query.search } }],
        }
      : {}),
  };
  const orderBy = { [query.sortBy]: query.sortOrder } as Prisma.UserOrderByWithRelationInput;

  const [items, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy,
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
      select: userSelect,
    }),
    prisma.user.count({ where }),
  ]);

  return { items, total };
}

export async function findUserById(id: string): Promise<UserRecord | null> {
  return prisma.user.findFirst({ where: { id, deletedAt: null }, select: userSelect });
}

type UserWriteData = {
  readonly email: string;
  readonly name: string;
  readonly passwordHash: string;
  readonly status: UserStatus;
  readonly roleCodes: readonly string[];
};

async function resolveRoleIds(
  client: Prisma.TransactionClient,
  roleCodes: readonly string[],
): Promise<readonly string[]> {
  const uniqueCodes = [...new Set(roleCodes)];
  if (uniqueCodes.length === 0) return [];

  const roles = await client.role.findMany({
    where: { code: { in: uniqueCodes } },
    select: { id: true, code: true },
  });
  if (roles.length !== uniqueCodes.length) {
    throw new Error("One or more role codes do not exist");
  }

  return roles.map(({ id }) => id);
}

export async function createUser(data: UserWriteData): Promise<UserRecord> {
  return prisma.$transaction(async (tx) => {
    const roleIds = await resolveRoleIds(tx, data.roleCodes);
    const user = await tx.user.create({
      data: {
        email: data.email,
        name: data.name,
        passwordHash: data.passwordHash,
        status: data.status,
        roles: {
          create: roleIds.map((roleId) => ({ roleId })),
        },
      },
      select: userSelect,
    });
    return user;
  });
}

export type UserUpdateData = {
  readonly name?: string;
  readonly passwordHash?: string;
  readonly status?: UserStatus;
  readonly roleCodes?: readonly string[];
};

export async function updateUser(id: string, data: UserUpdateData): Promise<UserRecord | null> {
  const existing = await findUserById(id);
  if (!existing) return null;

  return prisma.$transaction(async (tx) => {
    const { roleCodes, ...userData } = data;
    await tx.user.update({ where: { id }, data: userData });

    if (roleCodes !== undefined) {
      const roleIds = await resolveRoleIds(tx, roleCodes);
      await tx.userRole.deleteMany({ where: { userId: id } });
      if (roleIds.length > 0) {
        await tx.userRole.createMany({
          data: roleIds.map((roleId) => ({ userId: id, roleId })),
        });
      }
    }

    return tx.user.findUniqueOrThrow({ where: { id }, select: userSelect });
  });
}

export async function softDeleteUser(id: string): Promise<{ readonly id: string } | null> {
  const existing = await findUserById(id);
  if (!existing) return null;

  await prisma.$transaction([
    prisma.user.update({
      where: { id },
      data: { status: "INACTIVE", deletedAt: new Date() },
    }),
    prisma.session.updateMany({
      where: { userId: id, revokedAt: null },
      data: { revokedAt: new Date() },
    }),
  ]);

  return { id };
}
