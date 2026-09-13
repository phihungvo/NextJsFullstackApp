import "server-only";

import { createListMeta, type ListMeta } from "@/lib/api/query";
import { ERROR_CODES, ApplicationError } from "@/lib/api/errors";
import {
  findPermissionById,
  listPermissions,
  type PermissionListQuery,
  type PermissionRecord,
} from "@/server/repositories/permission.repository";

export type PermissionDto = {
  readonly id: string;
  readonly name: string;
  readonly code: string;
  readonly description: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
};

function toPermissionDto(permission: PermissionRecord): PermissionDto {
  return {
    id: permission.id,
    name: permission.name,
    code: permission.code,
    description: permission.description,
    createdAt: permission.createdAt.toISOString(),
    updatedAt: permission.updatedAt.toISOString(),
  };
}

export async function listPermissionService(query: PermissionListQuery): Promise<{
  readonly items: readonly PermissionDto[];
  readonly meta: ListMeta;
}> {
  const result = await listPermissions(query);
  return {
    items: result.items.map(toPermissionDto),
    meta: createListMeta(query.page, query.pageSize, result.total),
  };
}

export async function getPermissionService(id: string): Promise<PermissionDto> {
  const permission = await findPermissionById(id);
  if (!permission) throw new ApplicationError(ERROR_CODES.NOT_FOUND);
  return toPermissionDto(permission);
}
