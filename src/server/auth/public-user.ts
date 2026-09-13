import "server-only";

export type PublicUser = {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly status: string;
  readonly roles: readonly string[];
  readonly permissions: readonly string[];
};

type UserWithRoles = {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly status: string;
  readonly roles: ReadonlyArray<{
    readonly role: {
      readonly code: string;
      readonly permissions: ReadonlyArray<{ readonly permission: { readonly code: string } }>;
    };
  }>;
};

export function toPublicUser(user: UserWithRoles): PublicUser {
  const permissions = [
    ...new Set(
      user.roles.flatMap(({ role }) => role.permissions.map(({ permission }) => permission.code)),
    ),
  ];

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    status: user.status,
    roles: user.roles.map(({ role }) => role.code),
    permissions,
  };
}
