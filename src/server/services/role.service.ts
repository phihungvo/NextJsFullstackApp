import "server-only";

import { Prisma } from "@/generated/prisma/client";
import { createListMeta, type ListMeta } from "@/lib/api/query";
import { ERROR_CODES, ApplicationError } from "@/lib/api/errors";
import {
  createRole,
  deleteRole,
  findRoleById,
  listRoles,
  updateRole,
  type RoleListQuery,
  type RoleRecord,
  type RoleUpdateData,
} from "@/server/repositories/role.repository";

export type RoleDto = {
  readonly id: string;
  readonly name: string;
  readonly code: string;
  readonly description: string | null;
  readonly permissionCodes: readonly string[];
  readonly createdAt: string;
  readonly updatedAt: string;
};

export type RoleInput = {
  readonly name: string;
  readonly code: string;
  readonly description?: string | null;
  readonly permissionCodes: readonly string[];
};

export type RoleUpdateInput = Partial<RoleInput>;

function toRoleDto(role: RoleRecord): RoleDto {
  return {
    id: role.id,
    name: role.name,
    code: role.code,
    description: role.description,
    permissionCodes: role.permissions.map(({ permission }) => permission.code),
    createdAt: role.createdAt.toISOString(),
    updatedAt: role.updatedAt.toISOString(),
  };
}

function isUniqueConstraintError(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}

function isMissingPermissionError(error: unknown): boolean {
  return error instanceof Error && error.message === "One or more permission codes do not exist";
}

function isProtectedRole(role: RoleRecord): boolean {
  return role.code === "ADMIN" || role.code === "USER";
}

export async function listRoleService(query: RoleListQuery): Promise<{
  readonly items: readonly RoleDto[];
  readonly meta: ListMeta;
}> {
  const result = await listRoles(query);
  return {
    items: result.items.map(toRoleDto),
    meta: createListMeta(query.page, query.pageSize, result.total),
  };
}

export async function getRoleService(id: string): Promise<RoleDto> {
  const role = await findRoleById(id);
  if (!role) throw new ApplicationError(ERROR_CODES.NOT_FOUND);
  return toRoleDto(role);
}

export async function createRoleService(input: RoleInput): Promise<RoleDto> {
  try {
    return toRoleDto(await createRole({ ...input, description: input.description ?? null }));
  } catch (error) {
    if (isUniqueConstraintError(error)) throw new ApplicationError(ERROR_CODES.CONFLICT);
    if (isMissingPermissionError(error)) throw new ApplicationError(ERROR_CODES.NOT_FOUND);
    throw error;
  }
}

export async function updateRoleService(id: string, input: RoleUpdateInput): Promise<RoleDto> {
  const existing = await findRoleById(id);
  if (!existing) throw new ApplicationError(ERROR_CODES.NOT_FOUND);
  if (isProtectedRole(existing) && input.code !== undefined && input.code !== existing.code) {
    throw new ApplicationError(ERROR_CODES.CONFLICT, "System role không thể đổi code.");
  }

  try {
    const role = await updateRole(id, input as RoleUpdateData);
    if (!role) throw new ApplicationError(ERROR_CODES.NOT_FOUND);
    return toRoleDto(role);
  } catch (error) {
    if (isUniqueConstraintError(error)) throw new ApplicationError(ERROR_CODES.CONFLICT);
    if (isMissingPermissionError(error)) throw new ApplicationError(ERROR_CODES.NOT_FOUND);
    throw error;
  }
}

export async function deleteRoleService(
  id: string,
): Promise<{ readonly id: string; readonly deleted: true }> {
  const existing = await findRoleById(id);
  if (!existing) throw new ApplicationError(ERROR_CODES.NOT_FOUND);
  if (isProtectedRole(existing)) {
    throw new ApplicationError(ERROR_CODES.CONFLICT, "System role không thể bị xóa.");
  }

  try {
    const role = await deleteRole(id);
    if (!role) throw new ApplicationError(ERROR_CODES.NOT_FOUND);
    return { id: role.id, deleted: true };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003") {
      throw new ApplicationError(ERROR_CODES.CONFLICT);
    }
    throw error;
  }
}
