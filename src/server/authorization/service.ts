import "server-only";

import { ERROR_CODES, ApplicationError } from "@/lib/api/errors";
import { prisma } from "@/lib/db/prisma";

import { requireAuth } from "./require-auth";

export async function getUserPermissionCodes(userId: string): Promise<readonly string[]> {
  const userRoles = await prisma.userRole.findMany({
    where: { userId },
    select: {
      role: {
        select: {
          permissions: {
            select: {
              permission: {
                select: { code: true },
              },
            },
          },
        },
      },
    },
  });

  return [
    ...new Set(
      userRoles.flatMap(({ role }) => role.permissions.map(({ permission }) => permission.code)),
    ),
  ];
}

export async function hasPermission(userId: string, permissionCode: string): Promise<boolean> {
  const matchingRole = await prisma.userRole.findFirst({
    where: {
      userId,
      role: {
        permissions: {
          some: {
            permission: { code: permissionCode },
          },
        },
      },
    },
    select: { userId: true },
  });

  return matchingRole !== null;
}

export async function requirePermission(permissionCode: string) {
  const user = await requireAuth();
  const allowed = await hasPermission(user.id, permissionCode);

  if (!allowed) {
    throw new ApplicationError(ERROR_CODES.FORBIDDEN);
  }

  return user;
}
