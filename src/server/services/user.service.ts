import "server-only";

import { Prisma, type UserStatus } from "@/generated/prisma/client";
import { createListMeta, type ListMeta } from "@/lib/api/query";
import { ERROR_CODES, ApplicationError } from "@/lib/api/errors";
import { hashPassword } from "@/server/auth/password";
import {
  createUser,
  findUserById,
  listUsers,
  softDeleteUser,
  updateUser,
  type UserListQuery,
  type UserRecord,
  type UserUpdateData,
} from "@/server/repositories/user.repository";

export type UserDto = {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly status: UserStatus;
  readonly roles: readonly string[];
  readonly createdAt: string;
  readonly updatedAt: string;
};

export type UserInput = {
  readonly email: string;
  readonly name: string;
  readonly password: string;
  readonly status: UserStatus;
  readonly roleCodes: readonly string[];
};

export type UserUpdateInput = {
  readonly name?: string;
  readonly password?: string;
  readonly status?: UserStatus;
  readonly roleCodes?: readonly string[];
};

function toUserDto(user: UserRecord): UserDto {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    status: user.status,
    roles: user.roles.map(({ role }) => role.code),
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

function isUniqueConstraintError(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}

function isMissingRoleError(error: unknown): boolean {
  return error instanceof Error && error.message === "One or more role codes do not exist";
}

export async function listUserService(query: UserListQuery): Promise<{
  readonly items: readonly UserDto[];
  readonly meta: ListMeta;
}> {
  const result = await listUsers(query);
  return {
    items: result.items.map(toUserDto),
    meta: createListMeta(query.page, query.pageSize, result.total),
  };
}

export async function getUserService(id: string): Promise<UserDto> {
  const user = await findUserById(id);
  if (!user) throw new ApplicationError(ERROR_CODES.NOT_FOUND);
  return toUserDto(user);
}

export async function createUserService(input: UserInput): Promise<UserDto> {
  try {
    const user = await createUser({
      ...input,
      passwordHash: await hashPassword(input.password),
    });
    return toUserDto(user);
  } catch (error) {
    if (isUniqueConstraintError(error)) throw new ApplicationError(ERROR_CODES.CONFLICT);
    if (isMissingRoleError(error)) throw new ApplicationError(ERROR_CODES.NOT_FOUND);
    throw error;
  }
}

export async function updateUserService(
  id: string,
  input: UserUpdateInput,
  actorId: string,
): Promise<UserDto> {
  if (id === actorId && input.roleCodes !== undefined) {
    throw new ApplicationError(ERROR_CODES.FORBIDDEN);
  }

  const data: UserUpdateData = {
    name: input.name,
    status: input.status,
    roleCodes: input.roleCodes,
    ...(input.password ? { passwordHash: await hashPassword(input.password) } : {}),
  };

  try {
    const user = await updateUser(id, data);
    if (!user) throw new ApplicationError(ERROR_CODES.NOT_FOUND);
    return toUserDto(user);
  } catch (error) {
    if (isMissingRoleError(error)) throw new ApplicationError(ERROR_CODES.NOT_FOUND);
    throw error;
  }
}

export async function deleteUserService(
  id: string,
  actorId: string,
): Promise<{ readonly id: string; readonly deleted: true }> {
  if (id === actorId) throw new ApplicationError(ERROR_CODES.FORBIDDEN);
  const user = await softDeleteUser(id);
  if (!user) throw new ApplicationError(ERROR_CODES.NOT_FOUND);
  return { id: user.id, deleted: true };
}
