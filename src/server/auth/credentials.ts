import "server-only";

import { UserStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";

import { verifyPassword } from "./password";

export type AuthenticatedCredentialUser = {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly status: string;
  readonly passwordHash: string;
  readonly roles: ReadonlyArray<{
    readonly role: {
      readonly code: string;
      readonly permissions: ReadonlyArray<{ readonly permission: { readonly code: string } }>;
    };
  }>;
};

export async function authenticateCredentials(
  email: string,
  password: string,
): Promise<AuthenticatedCredentialUser | null> {
  const user = await prisma.user.findFirst({
    where: {
      email,
      status: UserStatus.ACTIVE,
      deletedAt: null,
    },
    select: {
      id: true,
      email: true,
      name: true,
      status: true,
      passwordHash: true,
      roles: {
        select: {
          role: {
            select: {
              code: true,
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
      },
    },
  });

  const passwordMatches = await verifyPassword(password, user?.passwordHash);
  if (!user || !passwordMatches) {
    return null;
  }

  return user;
}
